import { AppDataSource } from "../config";
import { InventoryHistory, Product } from "../models";

const inventoryHistoryRepository =
  AppDataSource.getRepository(InventoryHistory);
const productRepository = AppDataSource.getRepository(Product);
export const logInventoryChange = async (
  productId: string,
  quantity: number
) => {
  const product = await productRepository.findOneBy({ id: productId });

  if (!product) {
    throw new Error(`Product with ID ${productId} does not exist`);
  }
  const record = inventoryHistoryRepository.create({ product, quantity });
  await inventoryHistoryRepository.save(record);
  console.log(
    `Inventory change logged for product ${productId}, quantity: ${quantity}`
  );
};

export const fetchInventoryHistory = async (productId: string) => {
  return inventoryHistoryRepository.find({
    where: { product: { id: productId } },
    order: { timestamp: "DESC" },
    relations: ["product"],
  });
};
