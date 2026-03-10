import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error("Error:", err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};