import { AppDataSource } from "../config/database";
import { TrendingProduct } from "../models";

const trendRepository = AppDataSource.getRepository(TrendingProduct);

export const fetchTrendsByProductId = async (productId: string) =>
  trendRepository.find({ where: { product: { id: productId } } });

export const createTrend = async (trend: Partial<TrendingProduct>) =>
  trendRepository.save(trend);
