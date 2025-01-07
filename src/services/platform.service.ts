import { AppDataSource } from "../config";
import { Sales } from "../models/sales.model";

export const getPlatformMetrics = async (): Promise<PlatformMetrics[]> => {
  const salesRepository = AppDataSource.getRepository(Sales);

  try {
    const platformMetrics = await salesRepository.query(`
      WITH current_period AS (
        SELECT 
          p.name,
          SUM(s."totalRevenue") as revenue,
          COUNT(DISTINCT s.id) as orders,
          COUNT(DISTINCT s."productId") as products
        FROM sales s
        INNER JOIN product_platforms pp ON s."productId" = pp."productId"
        INNER JOIN platform p ON pp."platformId" = p.id
        WHERE s."saleDate" >= NOW() - INTERVAL '30 days'
        GROUP BY p.name
      ),
      previous_period AS (
        SELECT 
          p.name,
          SUM(s."totalRevenue") as revenue
        FROM sales s
        INNER JOIN product_platforms pp ON s."productId" = pp."productId"
        INNER JOIN platform p ON pp."platformId" = p.id
        WHERE s."saleDate" BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days'
        GROUP BY p.name
      )
      SELECT 
        cp.name,
        ROUND(cp.revenue::numeric, 2) as revenue,
        ROUND(((cp.revenue - COALESCE(pp.revenue, 0)) / NULLIF(pp.revenue, 0) * 100)::numeric, 1) as growth,
        CASE WHEN cp.revenue > COALESCE(pp.revenue, 0) THEN 'up' ELSE 'down' END as trend,
        ROUND((cp.orders::numeric / NULLIF(cp.products, 0) * 100), 1) as cvr
      FROM current_period cp
      LEFT JOIN previous_period pp ON cp.name = pp.name
      ORDER BY cp.revenue DESC
    `);

    return platformMetrics.map((metric: PlatformMetrics) => ({
      name: metric.name,
      revenue: Number(metric.revenue),
      growth: Number(metric.growth),
      trend: metric.trend as "up" | "down",
      cvr: Number(metric.cvr),
    }));
  } catch (error) {
    console.error("Platform metrics calculation error:", error);
    throw new Error("Failed to calculate platform metrics");
  }
};
