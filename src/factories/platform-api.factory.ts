import { ShopifyAPI } from "../integration";
import { PlatformApi } from "../interfaces";
export class PlatformApiFactory {
  private static configs: Record<string, any> = {
    shopify: {
      apiKey: process.env.SHOPIFY_API_KEY,
      shopDomain: process.env.SHOPIFY_SHOP_DOMAIN,
    },
    tiktok: {
      appKey: process.env.TIKTOK_APP_KEY,
      appSecret: process.env.TIKTOK_APP_SECRET,
      accessToken: process.env.TIKTOK_ACCESS_TOKEN,
    },
    instagram: {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    },
  };

  private static instances: Record<string, PlatformApi> = {};

  static getApi(platform: string): PlatformApi {
    // Return cached instance if exists
    if (this.instances[platform]) {
      return this.instances[platform];
    }

    // Create new instance based on platform
    switch (platform.toLowerCase()) {
      case "shopify":
        this.instances[platform] = new ShopifyAPI(this.configs.shopify);
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
    this.configs[platform] = config;
    // Clear cached instance to force new instance with new config
    delete this.instances[platform];
  }
}
