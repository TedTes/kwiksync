import { AppDataSource } from "../config";
export class InventoryRepository {
  static async getMerchantInventory(merchantId: number) {
    const result = await AppDataSource.query(
      `
        WITH platform_stats AS (
          SELECT 
            p.id as product_id,
            pp."platformId",
            plt.name as platform_name,
            pi.quantity as stock,
            COALESCE(
              (
                SELECT SUM(s."quantitySold") 
                FROM sales s 
                WHERE s."productId" = p.id
                AND s."saleDate" >= NOW() - INTERVAL '30 days'
              ), 0
            ) as sales,
            pp."isActive",
            pp."platformSku"
          FROM product p
          INNER JOIN merchant_product mp ON p.id = mp."productId"
          INNER JOIN product_inventory pi ON p.id = pi."productId"
          INNER JOIN product_platform pp ON p.id = pp."productId"
          INNER JOIN platform plt ON pp."platformId" = plt.id
          WHERE mp."merchantId" = $1
        )
        SELECT 
          p.id,
          p.name as product,
          p."sku",
          pi.quantity as stock,
          (
            SELECT pi.quantity - COALESCE(SUM(s."quantitySold"), 0)
            FROM sales s
            WHERE s."productId" = p.id
            AND s."saleDate" >= NOW() - INTERVAL '1 day'
          ) as "stockChange",
          CASE 
            WHEN pi.quantity <= pi."restockThreshold" * 0.5 THEN 'critical'
            WHEN pi.quantity <= pi."restockThreshold" THEN 'low'
            ELSE 'healthy'
          END as status,
          pp."platformPrice" as price,
          (
            SELECT to_char(MAX(s."saleDate"), 'HH24:MI:SS')
            FROM sales s
            WHERE s."productId" = p.id
          ) as "lastUpdated",
          jsonb_build_object(
            'tiktok', jsonb_build_object(
              'stock', (SELECT stock FROM platform_stats WHERE product_id = p.id AND platform_name = 'tiktok'),
              'sales', (SELECT sales FROM platform_stats WHERE product_id = p.id AND platform_name = 'tiktok'),
              'status', (SELECT CASE WHEN "isActive" THEN 'active' ELSE 'inactive' END FROM platform_stats WHERE product_id = p.id AND platform_name = 'tiktok')
            ),
            'instagram', jsonb_build_object(
              'stock', (SELECT stock FROM platform_stats WHERE product_id = p.id AND platform_name = 'instagram'),
              'sales', (SELECT sales FROM platform_stats WHERE product_id = p.id AND platform_name = 'instagram'),
              'status', (SELECT CASE WHEN "isActive" THEN 'active' ELSE 'inactive' END FROM platform_stats WHERE product_id = p.id AND platform_name = 'instagram')
            ),
            'shopify', jsonb_build_object(
              'stock', (SELECT stock FROM platform_stats WHERE product_id = p.id AND platform_name = 'shopify'),
              'sales', (SELECT sales FROM platform_stats WHERE product_id = p.id AND platform_name = 'shopify'),
              'status', (SELECT CASE WHEN "isActive" THEN 'active' ELSE 'inactive' END FROM platform_stats WHERE product_id = p.id AND platform_name = 'shopify')
            )
          ) as platforms
        FROM product p
        INNER JOIN merchant_product mp ON p.id = mp."productId"
        INNER JOIN product_inventory pi ON p.id = pi."productId"
        INNER JOIN product_platform pp ON p.id = pp."productId"
        WHERE mp."merchantId" = $1
        GROUP BY p.id, p.name, p.sku, pi.quantity, pi."restockThreshold", pp."platformPrice"
      `,
      [merchantId]
    );
    return result;
  }
}
