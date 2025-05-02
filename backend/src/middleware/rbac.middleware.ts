// middlewares/checkRole.ts
import { Request, Response, NextFunction } from "express";

export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role?: string }; // Ensure role exists

    if (!user || !user.role) {
      throw new Error("Unauthorized: No user found.");
    }

    if (user.role === requiredRole) {
      return next();
    }
    throw new Error("Unauthorized: Insufficient role.");
  };
};
