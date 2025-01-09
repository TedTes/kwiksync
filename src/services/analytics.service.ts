import { AppDataSource } from "../config";
import { Sales } from "../models";

const salesRepository = AppDataSource.getRepository(Sales);

export const fetchWeeklyRevenue = async () => {
  try {
    const weeklyData = await salesRepository.query(`
          SELECT 
            to_char(DATE_TRUNC('day', "saleDate"), 'Dy') as day,
            COALESCE(SUM("totalRevenue"), 0) as revenue
          FROM sales
          WHERE "saleDate" >= NOW() - INTERVAL '7 days'
          GROUP BY DATE_TRUNC('day', "saleDate"), day
          ORDER BY DATE_TRUNC('day', "saleDate")
        `);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return daysOfWeek.map((day) => ({
      day,
      revenue: Number(
        weeklyData.find((d: QueryResult) => d.day === day)?.revenue || 0
      ),
    }));
  } catch (error) {
    throw new Error("Failed to fetch weekly revenue");
  }
};

export const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  const salesRepository = AppDataSource.getRepository(Sales);

  try {
    const recentChanges = await salesRepository.query(`
        WITH recent_sales AS (
          SELECT 
            p.name as product,
            plt.name as platform,
            s."quantitySold" as change,
            pi.quantity as current_stock,
            s."saleDate" as sale_date
          FROM sales s
          INNER JOIN product p ON s."productId" = p.id
          INNER JOIN product_platform pp ON p.id = pp."productId"
          INNER JOIN platform plt ON pp."platformId" = plt.id
          INNER JOIN product_inventory pi ON p.id = pi."productId"
          WHERE s."saleDate" >= NOW() - INTERVAL '24 hours'
          ORDER BY s."saleDate" DESC
          LIMIT 10
        )
        SELECT 
          product,
          platform,
          -change as change,  -- Make negative since it's a sale
          current_stock as stock
        FROM recent_sales
        ORDER BY "sale_date" DESC
      `);
    return recentChanges;
  } catch (error) {
    console.error("Recent activity fetch error:", error);
    throw new Error("Failed to fetch recent activity");
  }
};

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
        INNER JOIN product_platform pp ON s."productId" = pp."productId"
        INNER JOIN platform p ON pp."platformId" = p.id
        WHERE s."saleDate" >= NOW() - INTERVAL '30 days'
        GROUP BY p.name
      ),
      previous_period AS (
        SELECT 
          p.name,
          SUM(s."totalRevenue") as revenue
        FROM sales s
        INNER JOIN product_platform pp ON s."productId" = pp."productId"
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
