import { AppDataSource } from "../config/database";
import { Product } from "../models/product.model";
import { sendLowStockAlert } from "./";

const productRepository = AppDataSource.getRepository(Product);

export const checkLowStock = async () => {
  try {
    console.log("Checking for low-stock products...");

    // Fetch products below the threshold
    const lowStockProducts = await productRepository
      .createQueryBuilder("product")
      .where("product.quantity < product.threshold")
      .getMany();

    if (lowStockProducts.length > 0) {
      console.log(`Found ${lowStockProducts.length} low-stock products.`);

      // Notify merchants about low-stock products
      for (const product of lowStockProducts) {
        await sendLowStockAlert(product);
      }
    } else {
      console.log("No low-stock products found.");
    }
  } catch (error) {
    console.error("Error checking low-stock products:", error);
  }
};
