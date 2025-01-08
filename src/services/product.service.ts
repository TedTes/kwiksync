import { AppDataSource } from "../config";
import { MerchantProduct, Product, ProductInventory } from "../models";
import { ProductRepository } from "../repositories";
const productRepository = AppDataSource.getRepository(Product);

export const fetchAllProducts = async () => await productRepository.find();

export const fetchProductById = async (
  id: number
): Promise<Partial<ProductInventory & Product> | undefined> => {
  try {
    const productInventoryRepository =
      AppDataSource.getRepository(ProductInventory);
    const productInventory = await productInventoryRepository.findOne({
      where: { product: { id } },
      relations: ["product"],
    });
    if (!productInventory) {
      throw "product not found!";
    }
    return productInventory;
  } catch (error) {
    console.log("error occured in fetchProductById", error);
    return undefined;
  }
};

export const createProduct = async (product: Partial<Product>) => {
  const newProduct = productRepository.create(product);
  return await productRepository.save(newProduct);
};

export const removeProduct = async (id: string) => productRepository.delete(id);

export const setRestockingRules = async (
  productId: number,
  merchantId: number,
  restockThreshold: number,
  restockAmount: number
) => {
  return await ProductRepository.updateRestockRules(productId, merchantId, {
    restockThreshold,
    restockAmount,
  });
};

export const restockProductById = async (id: number, quantity: number) => {
  const product = await fetchProductById(id);
  if (!product) throw new Error(`Product with ID ${id} not found`);
  product.quantity = quantity;
};

export const fetchMerchantProducts = async (merchantId: number) => {
  const merchantProduct = AppDataSource.getRepository(MerchantProduct);
  return merchantProduct.find({
    where: { merchant: { id: merchantId } },
    order: { listedDate: "DESC" },
  });
};

export const updateProduct = async (
  productId: number,
  merchantId: number,
  updates: Partial<Product>
) => {
  if (Object.keys(updates).length === 0) {
    throw new Error("No update fields provided");
  }
  return await ProductRepository.updateProduct(productId, merchantId, updates);
};

export const fetchLowStockProducts = async (merchantId: string) => {
  return productRepository
    .createQueryBuilder("product")
    .where("product.merchantId = :merchantId", { merchantId })
    .andWhere("product.quantity < product.restockThreshold")
    .orderBy("product.quantity", "ASC")
    .getMany();
};
