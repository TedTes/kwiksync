import { Decimal128, IntegerType } from "typeorm";

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
  interface PlatformData {
    stock: number;
    sales: number;
    status?: "active" | "inactive";
  }
  interface StatusBadgeProps {
    status: StatusType;
  }
  type StatusType = "low" | "critical" | "healthy";
  type PlatformType = "All" | "tiktok" | "instagram" | "shopify";
  interface SupplierInfo {
    id: string;
    name: string;
    price: number;
    leadTime: number;
    reliability: number;
    minOrderQuantity: number;
  }
  interface AutoOrderSettings {
    active: boolean;
    lowStockThreshold: number;
    reorderPoint: number;
    primarySupplier: string;
    secondarySupplier: string;
    selectionCriteria: "auto" | "price" | "leadTime" | "reliability";
  }

  interface Order {
    id: string;
    sku: string;
    supplier: string;
    quantity: number;
    status: OrderStatus;
    createdAt: Date;
    estimatedDelivery: Date;
    tracking?: string;
  }
  interface StatusBadgeProps {
    status: StatusType;
  }

  interface PlatformStock {
    platform: string;
    count: number;
  }
  interface PlatformStockProps {
    stocks: PlatformStock[];
  }
  // Types for order fulfillment
  interface OrderUpdate {
    id: string;
    status: OrderStatus;
    deliveryDate?: Date;
    quantity: number;
    sku: string;
  }
  interface IPlatformData {
    name: string;
    revenue: number;
    growth: number;
    trend: string;
    cvr: number;
  }

  interface IWeeklyData {
    day: weekDays;
    revenue: number;
  }
  interface IRecentActivity {
    product: string;
    platform: PlatformType;
    change: number;
    stock: number;
  }
  interface MerchantMetrics {
    totalProducts: number;
    totalRevenue: number;
    syncIssues: number;
    platformCount: number;
  }
  type OrderStatus =
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "delayed";
  type weekDays = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
}
declare module "*.png" {
  const value: string;
  export default value;
}
export {};
