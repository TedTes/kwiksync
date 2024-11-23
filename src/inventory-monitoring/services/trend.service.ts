import { AppDataSource } from "../config/database";
import { Trend } from "../models/trend.model";

const trendRepository = AppDataSource.getRepository(Trend);

export const fetchTrendsByProductId = async (productId: string) =>
  trendRepository.find({ where: { product: { id: parseInt(productId, 10) } } });

export const createTrend = async (trend: Partial<Trend>) =>
  trendRepository.save(trend);
