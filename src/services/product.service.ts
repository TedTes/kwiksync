import { AppDataSource } from "../config/database";
import { Product } from "../models/product.model";

const productRepository = AppDataSource.getRepository(Product);

export const fetchAllProducts = async () => await productRepository.find();

export const fetchProductById = async (id: string) =>
  await productRepository.findOneBy({ id });

export const createProduct = async (product: Partial<Product>) => {
  const newProduct = productRepository.create(product);
  return await productRepository.save(newProduct);
};

export const removeProduct = async (id: string) => productRepository.delete(id);

export const setRestockingRules = async (
  productId: string,
  merchantId: string,
  restockThreshold: number,
  restockAmount: number
) => {
  const product = await productRepository.findOne({
    where: { id: productId, merchant: { id: merchantId } },
  });

  if (!product) {
    throw new Error("Product not found or access denied");
  }

  product.restockThreshold = restockThreshold;
  product.restockAmount = restockAmount;

  return productRepository.save(product);
};

export const restockProductById = async (id: string, quantity: number) => {
  const product = await fetchProductById(id);
  if (!product) throw new Error(`Product with ID ${id} not found`);
  product.quantity = quantity;
};

export const fetchMerchantProducts = async (merchantId: string) => {
  return productRepository.find({
    where: { merchant: { id: merchantId } },
    order: { createdAt: "DESC" },
  });
};

export const updateProduct = async (
  productId: string,
  merchantId: string,
  updates: Partial<Product>
) => {
  const product = await productRepository.findOne({
    where: { id: productId, merchant: { id: merchantId } },
  });

  if (!product) {
    throw new Error("Product not found or access denied");
  }

  Object.assign(product, updates);
  return productRepository.save(product);
};

export const fetchLowStockProducts = async (merchantId: string) => {
  return productRepository
    .createQueryBuilder("product")
    .where("product.merchantId = :merchantId", { merchantId })
    .andWhere("product.quantity < product.restockThreshold")
    .orderBy("product.quantity", "ASC")
    .getMany();
};
