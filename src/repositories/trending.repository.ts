import { AppDataSource } from "../config";

export class TrendingRepository {
  static async getProductTrends(
    merchantId: number
  ): Promise<TrendingProduct[]> {
    return await AppDataSource.query(
      `
      WITH daily_metrics AS (
        SELECT 
          tp."productId",
          tp."platformId",
          SUM(tp.views) as views,
          SUM(tp.likes) as likes,
          SUM(tp.shares) as shares,
          SUM(tp.revenue) as revenue,
          SUM(tp."unitsSold") as units_sold,
          -- Previous period for trending
          LAG(SUM(tp.views)) OVER (
            PARTITION BY tp."productId", tp."platformId" 
            ORDER BY DATE_TRUNC('day', tp."updatedAt")
          ) as prev_views
        FROM trending_product tp
        INNER JOIN merchant_product mp ON tp."productId" = mp."productId"
        WHERE mp."merchantId" = $1
        AND tp."updatedAt" >= NOW() - INTERVAL '7 days'
        GROUP BY tp."productId", tp."platformId",tp."updatedAt"
      )
      SELECT 
        p.id,
        p.name,
        p.sku,
        plt.name as platform,
        jsonb_build_object(
          'engagement', RANK() OVER (ORDER BY (dm.likes + dm.shares) DESC),
          'views', RANK() OVER (ORDER BY dm.views DESC),
          'sales', RANK() OVER (ORDER BY dm.units_sold DESC)
        ) as rank,
        jsonb_build_object(
          'views', dm.views,
          'likes', dm.likes,
          'shares', dm.shares,
          'revenue', dm.revenue,
          'units_sold', dm.units_sold
        ) as metrics,
        jsonb_build_object(
          'views_change', ROUND(((dm.views - dm.prev_views)::float / NULLIF(dm.prev_views, 0)) * 100)
        ) as trending
      FROM daily_metrics dm
      INNER JOIN product p ON dm."productId" = p.id
      INNER JOIN platform plt ON dm."platformId" = plt.id
      ORDER BY dm.revenue DESC
      LIMIT 10;
      `,
      [merchantId]
    );
  }
}
