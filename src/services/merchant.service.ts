import { MerchantRepository } from "../repositories";
export class MerchantService {
  static async getMetrics(merchantId: number): Promise<MerchantMetrics> {
    try {
      return await MerchantRepository.getMerchantMetrics(merchantId);
    } catch (error: any) {
      throw new Error(`Failed to fetch merchant metrics: ${error.message}`);
    }
  }
}
