import { ShopifyAPI } from "../integration";
import { PlatformApi } from "../interfaces";
export class PlatformApiFactory {
  private static instances: Record<string, PlatformApi> = {};

  static getApi(
    platform: string,
    accessToken: string,
    shop: string
  ): PlatformApi {
    // Return cached instance if exists
    if (this.instances[platform]) {
      return this.instances[platform];
    }

    // Create new instance based on platform
    switch (platform.toLowerCase()) {
      case "shopify":
        this.instances[platform] = new ShopifyAPI(shop, accessToken);
        break;
      case "tiktok":
        //   this.instances[platform] = new TikTokApi(this.configs.tiktok);
        break;
      case "instagram":
        //   this.instances[platform] = new InstagramApi(this.configs.instagram);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    return this.instances[platform];
  }

  // Method to refresh configurations (useful for testing or token updates)
  static updateConfig(platform: string, config: any): void {
    // Clear cached instance to force new instance with new config
    delete this.instances[platform];
  }
}
