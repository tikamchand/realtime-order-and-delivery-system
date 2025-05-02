import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    console.log("----in error handler not instanceof----");
    const statusCode =
      "statusCode" in error
        ? error.statusCode
        : error instanceof mongoose.Error
        ? 400
        : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || "Something went wrong";
    error = new ApiError(
      statusCode as number,
      message,
      "errors" in error ? (error.errors as unknown as any[]) : [],
      err.stack
    );
  }
  console.log("----in error handler----");
  console.log(err);
  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  // Send error response
  return res.status((error as ApiError)?.statusCode).json(response);
};

export { errorHandler };
