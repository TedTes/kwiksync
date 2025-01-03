import { AppDataSource } from "../config";
import { TrendingProduct } from "../models";

const trendRepository = AppDataSource.getRepository(TrendingProduct);

export const fetchTrendsByProductId = async (productId: number) =>
  trendRepository.find({ where: { product: { id: productId } } });

export const createTrend = async (trend: Partial<TrendingProduct>) =>
  trendRepository.save(trend);
