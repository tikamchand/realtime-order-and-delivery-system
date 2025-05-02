import Cart from "../../models/cart.models.js";
import CartItem from "../../models/cartItem.models.js";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import Product from "../../models/product.models.js";

export const getCart = async (req: Request, res: Response) => {
  const user = req.user;

  const cart = await Cart.findOne({ userId: user?._id });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const cartItems = await CartItem.find({ cartId: cart._id }).populate(
    "productId"
  );

  if (!cartItems.length) {
    throw new ApiError(404, "No items found in the cart");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, { cart, cartItems }, "Cart fetched successfully")
    );
};
export const addToCart = async (req: Request, res: Response) => {
  const user = req.user;
  const { productId, quantity } = req.body;

  try {
    // Check if cart exists for the user
    let cart = await Cart.findOne({ userId: user?._id });
    if (!cart) {
      cart = new Cart({ userId: user?._id });
    }

    // Check if the item already exists in the cart
    const existingItem = await CartItem.findOne({
      cartId: cart._id,
      productId,
    });
    // check if the quantity is available
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    if (product.quantity < quantity) {
      throw new ApiError(400, "Not enough quantity available");
    }
    if (existingItem) {
      // Update the quantity if the item already exists
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      // Create a new cart item if it doesn't exist
      const newItem = new CartItem({
        cartId: cart._id,
        productId,
        quantity,
      });
      await newItem.save();
    }
    // Save the cart
    await cart.save();
    res
      .status(200)
      .json(new ApiResponse(200, cart, "Item added to cart successfully"));
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new ApiError(500, "Server error");
  }
};
