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
  if (!product) throw new Error(`Product with ID ${id} not found`);
  product.quantity = quantity;
  return productRepository.save(product);
};
