export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price?: number;
}

export interface Trend {
  productId: number;
  totalQuantity: number;
  totalRevenue: number;
}
