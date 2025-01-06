import { Router } from "express";
import { uploadFile } from "../controllers";
import multer from "multer";
export const userRoutes = Router();

// Configure multer for photo uploads
const storage = multer.memoryStorage(); // Store in memory before uploading to cloud
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

userRoutes.post("/photo", upload.single("photo"), uploadFile);
