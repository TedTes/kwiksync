import { AppDataSource } from "../config/database";
import { Sales } from "../models/sales.model";

const salesRepository = AppDataSource.getRepository(Sales);

export const fetchSalesReport = async (startDate: string, endDate: string) => {
  return salesRepository
    .createQueryBuilder("sales")
    .select("sales.productId", "productId")
    .addSelect("SUM(sales.quantitySold)", "totalQuantity")
    .addSelect("SUM(sales.totalRevenue)", "totalRevenue")
    .where("sales.saleDate BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    })
    .groupBy("sales.productId")
    .orderBy("totalRevenue", "DESC")
    .getRawMany();
};
