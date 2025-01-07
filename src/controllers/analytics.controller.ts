import { Request, Response, NextFunction } from "express";
import {
  fetchInventoryHistory,
  logInventoryChange,
  fetchSalesReport,
  fetchWeeklyRevenue,
  fetchRecentActivity,
} from "../services";

export const getInventoryHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.productId);
    const history = await fetchInventoryHistory(productId);

    res.status(200).json({ productId, history });
  } catch (error) {
    next(error);
  }
};

export const logInventoryChangeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = parseInt(req.params.productId);
  const quantity = parseInt(req.params.quantity, 10);

  await logInventoryChange(productId, quantity);
  res.status(200).json();
};

export const getSalesReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      next({ status: 400, message: "startDate and endDate are required" });
    }

    const report = await fetchSalesReport(
      startDate as string,
      endDate as string
    );

    res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
};
export const getWeeklyRevenue = async (req: Request, res: Response) => {
  try {
    const weeklyRevenue = await fetchWeeklyRevenue();
    res.json(weeklyRevenue);
  } catch (error) {
    console.error("Error in weekly revenue controller:", error);
    res.status(500).json({ error: "Failed to fetch weekly revenue" });
  }
};

export const getRecentActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activity = await fetchRecentActivity();
    res.json(activity);
  } catch (error) {
    console.error("Recent activity controller error:", error);
    res.status(500).json({
      error: "Failed to fetch recent activity",
    });
  }
};
