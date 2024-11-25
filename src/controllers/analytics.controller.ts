import { Request, Response, NextFunction } from "express";
import { fetchInventoryHistory, logInventoryChange } from "../services";

export const getInventoryHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId;
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
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity, 10);

  await logInventoryChange(productId, quantity);
  res.status(200).json();
};
