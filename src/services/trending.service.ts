import { TrendingRepository } from "../repositories";
export class TrendingService {
  static async getProductTrends(merchantId: number) {
    try {
      return await TrendingRepository.getProductTrends(merchantId);
    } catch (error: any) {
      throw new Error(`Failed to fetch trending products: ${error.message}`);
    }
  }
}
