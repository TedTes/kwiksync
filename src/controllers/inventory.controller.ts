import { Request, Response } from "express";
import { InventoryService } from "../services";

export const getInventory = async (req: Request, res: Response) => {
  try {
    const user = req.query as { id: string };
    const inventory = await InventoryService.getMerchantInventory(
      parseInt(user.id)
    );
    res.status(200).json(inventory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
