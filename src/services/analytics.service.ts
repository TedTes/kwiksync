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
            s."saleDate",
            (
              SELECT SUM(remaining."quantitySold")
              FROM sales remaining
              WHERE remaining."productId" = p.id
              AND remaining."saleDate" <= s."saleDate"
            ) as current_stock
          FROM sales s
          INNER JOIN product p ON s."productId" = p.id
          INNER JOIN product_platforms pp ON p.id = pp."productId"
          INNER JOIN platform plt ON pp."platformId" = plt.id
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
        ORDER BY "saleDate" DESC
      `);

    return recentChanges;
  } catch (error) {
    console.error("Recent activity fetch error:", error);
    throw new Error("Failed to fetch recent activity");
  }
};
