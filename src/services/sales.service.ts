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
