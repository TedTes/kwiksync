export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  price?: number;
  restockThreshold?: number;
  supplier?: string;
}

export interface Trend {
  productId: number;
  totalQuantity: number;
  totalRevenue: number;
}
