import { Request, Response } from "express";
import { MetricsService } from "../services";

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const user = req.query as { id: string };
    const metrics = await MetricsService.getMetrics(parseInt(user.id));
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
