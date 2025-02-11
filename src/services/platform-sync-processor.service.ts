export class PlatformSyncProcessor {
  async process(job: Job) {
    const { merchantId, platform, productId, newStock } = job.data;

    try {
      // Get platform API instance
      const api = PlatformApiFactory.getApi(platform);

      await api.updateStock(productId, newStock);

      const confirmedStock = await api.getStock(productId);

      await PlatformSyncRepository.updateSyncStatus(job.data.jobId, {
        status: "completed",
        actualStock: confirmedStock,
        completedAt: new Date().toISOString(),
      });

      return { success: true, stock: confirmedStock };
    } catch (error: any) {
      await PlatformSyncRepository.updateSyncStatus(job.data.jobId, {
        status: "failed",
        error: error.message,
        updatedAt: new Date().toISOString(),
      });

      throw error;
    }
  }
}
