import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

export const requestLogger = [
  morgan(":method :url :status :res[content-length] - :response-time ms"),
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Headers:", req.headers);
    console.log("Cookie Header:", req.headers.cookie);
    next();
  },
];
