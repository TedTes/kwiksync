import { Request, Response } from "express";
import { fetchWeeklyRevenue } from "../services";

export const getWeeklyRevenue = async (req: Request, res: Response) => {
  try {
    const weeklyRevenue = await fetchWeeklyRevenue();
    res.json(weeklyRevenue);
  } catch (error) {
    console.error("Error in weekly revenue controller:", error);
    res.status(500).json({ error: "Failed to fetch weekly revenue" });
  }
};
