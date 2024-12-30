import { Request, Response } from "express";
import { fetchTrendsByProductId, createTrend } from "../services";

export const getTrendsByProductId = async (req: Request, res: Response) => {
  const parsedProductId = parseInt(req.params.productId);
  const trends = await fetchTrendsByProductId(parsedProductId);
  res.json(trends);
};

export const addTrend = async (req: Request, res: Response) => {
  const newTrend = await createTrend(req.body);
  res.status(201).json(newTrend);
};
