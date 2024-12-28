import { fetchTikTokInventory } from "../integration/tiktokApi";
import { AppDataSource } from "../config";
import { Product } from "../models/product.model";
import { fetchProductById, restockProductById, createProduct } from "./";
const productRepository = AppDataSource.getRepository(Product);

export const syncTikTokInventory = async () => {
  try {
    console.log("Starting TikTok inventory sync...");
    const tiktokProducts = await fetchTikTokInventory();

    for (const tiktokProduct of tiktokProducts) {
      const dbProduct = await fetchProductById(tiktokProduct.id);
      if (dbProduct) {
        // Check if the stock levels differ
        if (dbProduct.quantity !== tiktokProduct.stock) {
          await restockProductById(tiktokProduct.id, tiktokProduct.stock);

          console.log(`Updated stock for product: ${dbProduct.name}`);
        }
      } else {
        //  Add new products from TikTok to database
        await createProduct({
          name: tiktokProduct.name,
          description: tiktokProduct.description,
          quantity: tiktokProduct.stock,
          id: tiktokProduct.id,
        });

        console.log(`Added new product from TikTok: ${tiktokProduct.name}`);
      }
    }

    console.log("TikTok inventory sync completed.");
  } catch (error) {
    console.error("Error syncing TikTok inventory:", error);
  }
};
