import { AppDataSource } from "../config";
export class PlatformConnectionRepository {
  static async getMerchantPlatformStats(merchantId: number) {
    return await AppDataSource.query(
      `
        WITH platform_stats AS (
          SELECT 
            p.id as "platformId",
            p.name,
            COUNT(DISTINCT pp."productId") as products,
            MAX(pp."updatedAt") as "lastSync",
            COUNT(DISTINCT CASE 
              WHEN pp."platformSku" IS NULL OR pp."platformPrice" IS NULL 
              THEN pp."productId" 
            END) as "syncIssues",
            COALESCE(SUM(s."totalRevenue"), 0) as revenue,
            COUNT(DISTINCT CASE 
              WHEN pi.quantity <= pi."restockThreshold" 
              THEN pp."productId" 
            END) as "lowStockItems",
            ROUND(
              (COUNT(pp."productId") - COUNT(CASE WHEN pp."platformSku" IS NULL OR pp."platformPrice" IS NULL THEN 1 END))::float 
              / NULLIF(COUNT(pp."productId"), 0),
              2
            ) as "syncHealth"
          FROM platform p
          INNER JOIN product_platform pp ON p.id = pp."platformId"
          INNER JOIN merchant_product mp ON pp."productId" = mp."productId"
          LEFT JOIN product_inventory pi ON pp."productId" = pi."productId"
          LEFT JOIN sales s ON pp."productId" = s."productId"
            AND s."saleDate" >= NOW() - INTERVAL '30 days'
          WHERE mp."merchantId" = $1
          GROUP BY p.id, p.name
        ),
        category_stats AS (
          SELECT 
            p."platformId",
            jsonb_agg(DISTINCT prod.category) as categories
          FROM platform_stats p
          INNER JOIN product_platform pp ON p."platformId" = pp."platformId"
          INNER JOIN product prod ON pp."productId" = prod.id
          WHERE prod.category IS NOT NULL
          GROUP BY p."platformId"
        ),
        performance_metrics AS (
          SELECT
            p."platformId",
            ROUND(
              COUNT(DISTINCT s.id)::float / NULLIF(COUNT(DISTINCT pv.id), 0) * 100,
              1
            ) as "conversionRate",
            ROUND(
              COALESCE(AVG(s."totalRevenue"), 0),
              2
            ) as "averageOrderValue",
            COALESCE(SUM(s."totalRevenue"), 0) as "totalSales"
          FROM platform_stats p
          INNER JOIN product_platform pp ON p."platformId" = pp."platformId"
          LEFT JOIN product_views pv ON pp."productId" = pv."productId"
          LEFT JOIN sales s ON pp."productId" = s."productId"
            AND s."saleDate" >= NOW() - INTERVAL '30 days'
          GROUP BY p."platformId"
        )
        SELECT 
          ps.name,
          'connected' as status,
          ps.products,
          to_char(NOW() - ps."lastSync", 'MI "mins ago"') as "lastSync",
          ps."syncIssues",
          ps.revenue,
          ps."lowStockItems",
          ps."syncHealth",
          cs.categories as "productCategories",
          jsonb_build_object(
            'conversionRate', pm."conversionRate",
            'averageOrderValue', pm."averageOrderValue",
            'totalSales', pm."totalSales"
          ) as "performanceMetrics"
        FROM platform_stats ps
        LEFT JOIN category_stats cs ON ps."platformId" = cs."platformId"
        LEFT JOIN performance_metrics pm ON ps."platformId" = pm."platformId"
        ORDER BY ps.revenue DESC;
      `,
      [merchantId]
    );
  }
}
