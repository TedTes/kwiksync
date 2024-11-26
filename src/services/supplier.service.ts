import { AppDataSource } from "../config/database";
import { Product } from "../models/product.model";
import { Supplier } from "../models/supplier.model";

const productRepository = AppDataSource.getRepository(Product);
const supplierRepository = AppDataSource.getRepository(Supplier);

export const linkProductToSupplier = async (
  productId: string,
  supplierId: string,
  merchantId: string
) => {
  const product = await productRepository.findOne({
    where: { id: productId, merchant: { id: merchantId } },
  });

  if (!product) {
    throw new Error("Product not found or access denied");
  }

  const supplier = await supplierRepository.findOneBy({ id: supplierId });
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  product.supplier = supplier;
  return productRepository.save(product);
};
