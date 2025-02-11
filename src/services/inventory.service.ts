import { InventoryRepository } from "../repositories";
import { platformSyncQueue } from "../queues";
export class InventoryService {
  static async getMerchantInventory(
    merchantId: number
  ): Promise<InventoryItem[]> {
    try {
      const inventory = await InventoryRepository.getMerchantInventory(
        merchantId
      );

      return inventory.map((item: InventoryItem) => ({
        ...item,
        lastUpdated: `${Math.floor(Math.random() * 60)} mins ago`, // temporary for demo
      }));
    } catch (error: any) {
      throw new Error(`Failed to fetch inventory: ${error.message}`);
    }
  }

  static async updateInventoryItem(
    merchantId: number,
    item: InventoryItem
  ): Promise<InventoryItem> {
    try {
      const updatedItem = await InventoryRepository.updateInventoryItem(
        merchantId,
        item
      );

      // Queue platform sync jobs
      await this.queuePlatformSyncs(merchantId, item);

      return updatedItem;
    } catch (error: any) {
      throw new Error(`Failed to update inventory item: ${error.message}`);
    }
  }
  private static async queuePlatformSyncs(
    merchantId: number,
    item: InventoryItem
  ) {
    // Create sync jobs for each configured platform
    const syncJobs = Object.entries(item.platforms)
      .filter(([_, platformData]) => platformData.status === "active")
      .map(([platform, platformData]) => ({
        jobId: `${merchantId}-${item.id}-${platform}`,
        merchantId,
        itemId: item.id,
        platform,
        sku: item.sku,
        productId: item.id,
        newStock: item.stock,
        status: "pending",
        createdAt: new Date().toISOString(),
      }));

    // Add to job queue
    await Promise.all(
      syncJobs.map((job) =>
        platformSyncQueue.add("syncInventory", job, {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 60000, // 1 minute initial delay
          },
        })
      )
    );
  }

  static async getItemSyncStatus(
    merchantId: number,
    itemId: string
  ): Promise<PlatformSyncStatus[]> {
    try {
      return await PlatformSyncRepository.getItemSyncStatus(merchantId, itemId);
    } catch (error: any) {
      throw new Error(`Failed to get sync status: ${error.message}`);
    }
  }
  static async reconcileInventory(
    merchantId: number,
    itemId: string
  ): Promise<InventoryItem> {
    try {
      const item = await InventoryRepository.getInventoryItem(
        merchantId,
        itemId
      );

      // Get current stock from each platform
      const platformStocks = await Promise.all(
        Object.entries(item.platforms)
          .filter(([_, data]) => data.productId)
          .map(async ([platform, data]) => {
            const api = PlatformApiFactory.getApi(platform);
            const stock = await api.getStock(data.productId);
            return { platform, stock };
          })
      );

      // Update database with platform stocks
      const updatedItem = await InventoryRepository.updatePlatformStocks(
        merchantId,
        itemId,
        platformStocks
      );

      return updatedItem;
    } catch (error: any) {
      throw new Error(`Failed to reconcile inventory: ${error.message}`);
    }
  }
}
