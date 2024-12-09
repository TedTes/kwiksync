export {};

declare global {
  interface Metrics {
    views: number;
    likes: number;
    shares: number;
    revenue: number;
    units_sold: number;
    conversion_rate: number;
  }
  interface Trending {
    views_change: number;
    likes_change: number;
    sales_change: number;
  }

  interface Product {
    id: number;
    name: string;
    sku: string;
    platform: string;
    rank: Rank;
    metrics: Metrics;
    quantity?: number;
    trending: Trending;
    performance: Performance2[];
  }

  interface Rank {
    [key: string]: number;
    engagement: number;
    views: number;
    sales: number;
  }
  interface ProductCardProps {
    product: Product;
  }
  interface Performance2 {
    date: string;
    views: number;
    sales: number;
    revenue: number;
  }
  interface Platform {
    name: string;
    status: string;
    products: number;
    lastSync: string;
    syncIssues: number;
    syncHealth: number;
    productCategories: string[];
    performanceMetrics: {
      conversionRate: number;
      averageOrderValue: number;
      totalSales: number;
    };
    revenue: number;
    lowStockItems: number;
  }
  interface Trend {
    productId: number;
    totalQuantity: number;
    totalRevenue: number;
  }
}
