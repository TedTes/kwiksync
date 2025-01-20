import morgan from "morgan";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const getMorganMiddleware = () => {
  if (process.env.NODE_ENV === "production") {
    const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a", // Append mode
    });
    return morgan("combined", { stream: logStream });
  } else {
    return morgan(
      ":method :url :status :res[content-length] - :response-time ms"
    );
  }
};

const logSafeRequestInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);

  const safeHeaders = {
    "user-agent": req.headers["user-agent"],
    host: req.headers["host"],
  };
  console.log("Safe Headers:", safeHeaders);

  next();
};

export const requestLogger = [getMorganMiddleware(), logSafeRequestInfo];
