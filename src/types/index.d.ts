declare global {
  interface EmailContent {
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachments?: EmailAttachment[];
  }
  interface EmailAttachment {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }
  interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  }

  interface s3FileObj {
    bucket: string;
    key: string;
    body: Buffer | Uint8Array | string;
    mimeType: string;
  }

  interface WeeklyRevenue {
    day: string;
    revenue: number;
  }

  interface QueryResult {
    day: string;
    revenue: string;
  }

  interface PlatformMetrics {
    name: string;
    revenue: number;
    growth: number;
    trend: "up" | "down";
    cvr: number;
  }
  interface RecentActivity {
    product: string;
    platform: string;
    change: number;
    stock: number;
  }
  interface InventoryItem {
    id: string;
    product: string;
    sku: string;
    platform: PlatformType;
    stock: number;
    stockChange: number;
    status: StatusType;
    lastUpdated: string;
    price: number;
    platforms: {
      tiktok: PlatformData;
      instagram: PlatformData;
      shopify: PlatformData;
    };
  }
  interface SupplierProduct {
    productId: number;
    supplierId: number;
    price?: number;
    startDate?: Date;
  }
  interface RestockRules {
    restockThreshold: number;
    restockAmount: number;
  }

  interface ProductUpdate {
    name?: string;
    description?: string;
    quantity?: number;
    restockThreshold?: number;
    restockAmount?: number;
  }
  interface MerchantMetrics {
    totalProducts: number;
    totalRevenue: number;
    syncIssues: number;
    platformCount: number;
  }
}

export {};
