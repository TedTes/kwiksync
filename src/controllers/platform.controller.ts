import { Request, Response } from "express";
import { getPlatformMetrics } from "../services";

export const getPlatformPerformance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const platformMetrics = await getPlatformMetrics();
    res.json(platformMetrics);
  } catch (error) {
    console.error("Platform controller error:", error);
    res.status(500).json({
      error: "Failed to fetch platform performance",
    });
  }
};
