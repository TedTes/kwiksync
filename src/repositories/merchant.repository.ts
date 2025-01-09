import { AppDataSource } from "../config";

export class MerchantRepository {
  static async getMerchantMetrics(
    merchantId: number
  ): Promise<MerchantMetrics> {
    const result = await AppDataSource.query(
      `
        SELECT 
          (
            SELECT COUNT(DISTINCT p.id)
            FROM product p
            INNER JOIN merchant_product mp ON p.id = mp."productId"
            WHERE mp."merchantId" = $1
          ) as "totalProducts",
          
          (
            SELECT COALESCE(SUM(s."totalRevenue"), 0)
            FROM sales s
            INNER JOIN merchant_product mp ON s."productId" = mp."productId"
            WHERE mp."merchantId" = $1
            AND s."saleDate" >= NOW() - INTERVAL '30 days'
          ) as "totalRevenue",
          
          (
            SELECT COUNT(*)
            FROM (
              SELECT pp."productId"
              FROM product_platform pp
              INNER JOIN merchant_product mp ON pp."productId" = mp."productId"
              WHERE mp."merchantId" = $1
              AND (
                pp."platformPrice" IS NULL
                OR pp."platformSku" IS NULL
                OR pp."isActive" = false
              )
              GROUP BY pp."productId"
            ) sync_issues
          ) as "syncIssues",
          
          (
            SELECT COUNT(DISTINCT pp."platformId")
            FROM product_platform pp
            INNER JOIN merchant_product mp ON pp."productId" = mp."productId"
            WHERE mp."merchantId" = $1
            AND pp."isActive" = true
          ) as "platformCount"
      `,
      [merchantId]
    );

    return result[0];
  }
}

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
