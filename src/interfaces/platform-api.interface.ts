export interface PlatformApi {
  updateStock(productId: string, stock: number): Promise<void>;
  getStock(productId: string): Promise<number>;
}
