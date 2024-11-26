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

export const createSupplier = async (
  name: string,
  email: string,
  phone?: string
) => {
  const supplier = supplierRepository.create({ name, email, phone });
  return supplierRepository.save(supplier);
};

export const editSupplier = async (
  supplierId: string,
  updates: Partial<Supplier>
) => {
  const supplier = await supplierRepository.findOneBy({ id: supplierId });
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  Object.assign(supplier, updates);
  return supplierRepository.save(supplier);
};

export const deleteSupplier = async (supplierId: string) => {
  const supplier = await supplierRepository.findOneBy({ id: supplierId });
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  await supplierRepository.remove(supplier);
};

export const fetchMerchantSuppliers = async (merchantId: string) => {
  return supplierRepository
    .createQueryBuilder("supplier")
    .innerJoinAndSelect(
      "supplier.products",
      "product",
      "product.merchantId = :merchantId",
      {
        merchantId,
      }
    )
    .getMany();
};
