import Product from "../../models/product.models.js";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new ApiError(500, "Server error");
  }
};
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new ApiError(500, "Server error");
  }
};
