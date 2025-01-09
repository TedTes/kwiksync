import { Request, Response } from "express";
import { MerchantService } from "../services";

export const getMerchantMetrics = async (req: Request, res: Response) => {
  try {
    const merchant = req.user as { merchantId: number };
    const metrics = await MerchantService.getMetrics(merchant.merchantId);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
