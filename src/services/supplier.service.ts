import { AppDataSource } from "../config";
import { Product } from "../models/product.model";
import { Supplier } from "../models/supplier.model";
import { SupplierRepository } from "../repositories";
const productRepository = AppDataSource.getRepository(Product);
const supplierRepository = AppDataSource.getRepository(Supplier);

export const linkProductToSupplier = async (
  productId: number,
  supplierId: number,
  merchantId: number
) => {
  const exists = await SupplierRepository.findProductAndSupplier(
    productId,
    supplierId,
    merchantId
  );
  if (!exists) {
    throw new Error("Product not found or access denied");
  }

  return await SupplierRepository.createSupplierProduct({
    productId,
    supplierId,
    startDate: new Date(),
  });
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
  supplierId: number,
  updates: Partial<Supplier>
) => {
  const supplier = await supplierRepository.findOneBy({ id: supplierId });
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  Object.assign(supplier, updates);
  return supplierRepository.save(supplier);
};

export const deleteSupplier = async (supplierId: number) => {
  const supplier = await supplierRepository.findOneBy({ id: supplierId });
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  await supplierRepository.remove(supplier);
};

export const fetchMerchantSuppliers = async (merchantId: number) => {
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
