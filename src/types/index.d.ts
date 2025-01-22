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

  interface Rank {
    engagement: number;
    views: number;
    sales: number;
  }

  interface Metrics {
    views: number;
    likes: number;
    shares: number;
    revenue: number;
    units_sold: number;
    conversion_rate: number;
  }

  interface TrendingChanges {
    views_change: number;
    likes_change: number;
    sales_change: number;
  }

  interface DailyPerformance {
    date: string;
    views: number;
    sales: number;
    revenue: number;
  }
  interface PerformanceMetrics {
    conversionRate: number;
    averageOrderValue: number;
    totalSales: number;
  }

  interface PlatformConnection {
    name: string;
    status: "connected" | "disconnected";
    products: number;
    lastSync: string;
    syncIssues: number;
    revenue: number;
    lowStockItems: number;
    syncHealth: number;
    productCategories: string[];
    performanceMetrics: PerformanceMetrics;
  }
  interface TrendingProduct {
    id: number;
    name: string;
    sku: string;
    platform: string;
    rank: Rank;
    metrics: Metrics;
    trending: TrendingChanges;
    performance: DailyPerformance[];
  }

  interface RouteConfig {
    path: string;
    router: Router;
    middleware?: any[];
  }

  //COOKIES TYPES
  interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    expires?: Date;
    maxAge?: number;
  }
  interface Cookies {
    accessToken: {
      name: string;
      options: CookieOptions;
    };
    refreshToken: {
      name: string;
      options: CookieOptions;
    };
  }

  //USER TYPES
  interface IVerifiedUser {
    isSuccess: boolean;
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
}

export {};
