import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import User, { IUser } from "../models/user.models.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    console.log(req.headers["authorization"]);
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById((decoded as any).id);

    if (!user) {
      throw new ApiError(401, "Unauthorized access");
    }

    req.user = user as IUser; // Attach the user to the request object
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized access");
  }
};
