import { MetricsRepository } from "../repositories";
export class MetricsService {
  static async getMetrics(merchantId: number): Promise<MerchantMetrics> {
    try {
      return await MetricsRepository.getMetrics(merchantId);
    } catch (error: any) {
      throw new Error(`Failed to fetch merchant metrics: ${error.message}`);
    }
  }
}
