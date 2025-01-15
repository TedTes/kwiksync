import { Request, Response } from "express";
import { PlatformConnectionService } from "../services";
export const getPlatformConnections = async (req: Request, res: Response) => {
  try {
    const user = req.query as { id: string };
    const platforms = await PlatformConnectionService.getMerchantPlatforms(
      parseInt(user.id)
    );
    res.json(platforms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
