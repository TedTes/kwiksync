import { Request, Response } from "express";
import { fetchTrendsByProductId, createTrend } from "../services";

export const getTrendsByProductId = async (req: Request, res: Response) => {
  const trends = await fetchTrendsByProductId(req.params.productId);
  res.json(trends);
};

export const addTrend = async (req: Request, res: Response) => {
  const newTrend = await createTrend(req.body);
  res.status(201).json(newTrend);
};
