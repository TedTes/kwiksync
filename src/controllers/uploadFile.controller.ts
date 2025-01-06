import { Request, Response } from "express";
import { upload } from "../services";

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No photo uploaded" });
      return;
    }
    const fileUrl = await upload(file);

    res.json({ fileUrl });
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ error: "Failed to upload photo" });
  }
};
