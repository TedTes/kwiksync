import { AppDataSource } from "../config/database";
import { Product } from "../models/product.model";

const productRepository = AppDataSource.getRepository(Product);

export const fetchAllProducts = async () => productRepository.find();

export const fetchProductById = async (id: string) =>
  productRepository.findOneBy({ id: parseInt(id, 10) });

export const createProduct = async (product: Partial<Product>) =>
  productRepository.save(product);

export const modifyProduct = async (id: string, updates: Partial<Product>) =>
  productRepository.update(id, updates);

export const removeProduct = async (id: string) => productRepository.delete(id);

export const fetchLowStockProducts = async () =>
  productRepository
    .createQueryBuilder("product")
    .where("product.quantity < product.threshold")
    .getMany();

export const restockProductById = async (id: string, quantity: number) => {
  const product = await fetchProductById(id);
  if (!product) throw new Error("Product not found");
  product.quantity += quantity;
  return productRepository.save(product);
};
