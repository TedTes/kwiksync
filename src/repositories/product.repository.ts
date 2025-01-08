import { AppDataSource } from "../config";

export class ProductRepository {
  static async updateRestockRules(
    productId: number,
    merchantId: number,
    rules: RestockRules
  ) {
    const result = await AppDataSource.query(
      `
        WITH merchant_check AS (
          SELECT 1
          FROM merchant_product mp
          WHERE mp."productId" = $1 
          AND mp."merchantId" = $2
          LIMIT 1
        )
        UPDATE product_inventory pi
        SET 
          "restockThreshold" = $3,
          "restockAmount" = $4,
          "updatedAt" = NOW()
        FROM merchant_check
        WHERE pi."productId" = $1
        RETURNING *
      `,
      [productId, merchantId, rules.restockThreshold, rules.restockAmount]
    );

    if (!result[0]) {
      throw new Error("Product not found or access denied");
    }

    return result[0];
  }

  static async updateProduct(
    productId: number,
    merchantId: number,
    updates: ProductUpdate
  ) {
    // Build dynamic update fields
    const updateFields = Object.entries(updates)
      .filter(([_, value]) => value !== undefined)
      .map(([key], index) => `"${key}" = $${index + 3}`);

    const updateValues = Object.values(updates).filter(
      (value) => value !== undefined
    );

    const result = await AppDataSource.query(
      `
      WITH merchant_check AS (
        SELECT 1 FROM merchant_product mp
        WHERE mp."productId" = $1 
        AND mp."merchantId" = $2
        LIMIT 1
      )
      UPDATE product p
      SET 
        ${updateFields.join(", ")},
        "updatedAt" = NOW()
      FROM merchant_check
      WHERE p.id = $1
      RETURNING 
        p.*,
        (
          SELECT json_build_object(
            'stockQuantity', mp."stockQuantity",
            'sellingPrice', mp."sellingPrice"
          )
          FROM merchant_product mp
          WHERE mp."productId" = p.id
          AND mp."merchantId" = $2
        ) as merchant_data
    `,
      [productId, merchantId, ...updateValues]
    );

    if (!result[0]) {
      throw new Error("Product not found or access denied");
    }

    return result[0];
  }
}
