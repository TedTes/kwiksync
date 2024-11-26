import { AppDataSource } from "../config/database";
import { TrendingProduct, Product } from "../models";
import { fetchProductEngagement } from "../clients/tiktokApi";
import { sendTrendingNotification } from "./notification.service";

const productRepository = AppDataSource.getRepository(Product);
const trendingProductRepository = AppDataSource.getRepository(TrendingProduct);

export const trackTrends = async () => {
  try {
    console.log("Fetching TikTok engagement data...");
    const engagementData = await fetchProductEngagement();

    for (const data of engagementData) {
      const { productId, likes, views, shares } = data;

      const product = await productRepository.findOneBy({
        id: productId,
      });
      if (!product) {
        console.warn(`Product with ID ${productId} not found in database.`);
        continue;
      }

      //TODO: Define trending thresholds ?????
      const trendingThreshold = {
        likes: 1000,
        views: 5000,
        shares: 100,
      };

      const isTrending =
        likes >= trendingThreshold.likes &&
        views >= trendingThreshold.views &&
        shares >= trendingThreshold.shares;

      let trendingProduct = await trendingProductRepository.findOneBy({
        id: product.id,
      });
      if (trendingProduct) {
        trendingProduct.likes = likes;
        trendingProduct.views = views;
        trendingProduct.shares = shares;
        trendingProduct.isTrending = isTrending;
        await trendingProductRepository.save(trendingProduct);
      } else {
        trendingProduct = trendingProductRepository.create({
          productId: product.id,
          merchantId: product.merchantId,
          likes,
          views,
          shares,
          isTrending,
        });
        await trendingProductRepository.save(trendingProduct);
      }

      if (isTrending) {
        await sendTrendingNotification(product.merchant.id, product.name);
      }
    }
  } catch (error) {
    console.error("Error tracking trends:", error);
  }
};