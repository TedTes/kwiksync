import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user; //  `user` is added to the request by authentication middleware

      if (!user) {
        next({ status: 401, message: "Unauthorized: No user found" });
      }

      if (!roles.includes(user.role)) {
        next({ status: 403, message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      next({ status: 500, message: "Internal server error" });
    }
  };
};
