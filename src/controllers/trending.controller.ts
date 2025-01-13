import { Request, Response } from "express";
import { TrendingService } from "../services";
export const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    const user = req.query as { id: string };
    const trends = await TrendingService.getProductTrends(parseInt(user.id));
    res.json(trends);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
