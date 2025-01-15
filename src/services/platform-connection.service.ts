import { PlatformConnectionRepository } from "../repositories";
export class PlatformConnectionService {
  static async getMerchantPlatforms(
    merchantId: number
  ): Promise<PlatformConnection[]> {
    try {
      return await PlatformConnectionRepository.getMerchantPlatformStats(
        merchantId
      );
    } catch (error: any) {
      throw new Error(`Failed to fetch platform connections: ${error.message}`);
    }
  }
}
