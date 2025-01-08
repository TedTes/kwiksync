import { AppDataSource } from "../config";

export class SupplierRepository {
  static async findProductAndSupplier(
    productId: number,
    supplierId: number,
    merchantId: number
  ) {
    const result = await AppDataSource.query(
      `
        SELECT 
          p.id as "productId",
          s.id as "supplierId"
        FROM product p
        INNER JOIN merchant_product mp ON p.id = mp."productId"
        INNER JOIN supplier s ON s.id = $2
        WHERE p.id = $1 
        AND mp."merchantId" = $3
        LIMIT 1
      `,
      [productId, supplierId, merchantId]
    );

    return result[0];
  }

  static async createSupplierProduct(data: SupplierProduct) {
    return await AppDataSource.query(
      `
          INSERT INTO supplier_product 
          ("productId", "supplierId", "startDate")
          VALUES ($1, $2, NOW())
          RETURNING *
        `,
      [data.productId, data.supplierId]
    );
  }
}
