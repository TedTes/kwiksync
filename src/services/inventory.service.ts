import { InventoryRepository } from "../repositories";

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
}
