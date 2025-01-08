import { AppDataSource } from "../config";
import { Product } from "../models/product.model";

export const getMerchantByProductId = async (productId: number) => {
  try {
    const merchantData = await AppDataSource.createQueryBuilder()
      .select([
        'm.id as "merchantId"',
        'm.name as "merchantName"',
        'm.email as "merchantEmail"',
        'mp."sellingPrice"',
        'mp."stockQuantity"',
      ])
      .from("merchant_product", "mp")
      .innerJoin("merchant", "m", 'm.id = mp."merchantId"')
      .where('mp."productId" = :productId', { productId })
      .getRawOne();

    console.log("from merchant repo");
    console.log(merchantData);
    return merchantData;
  } catch (error: any) {
    throw new Error(
      `Failed to fetch merchant data: ${error?.message} || ${error}`
    );
  }
};
