import User from "../../models/user.models.js";
import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }
    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
    });
    await newUser.save();
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { message: "User registered successfully" },
          "User registered successfully"
        )
      );
  }
);
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }
  // Check password
  const isMatch = user && (await user.comparePassword(password));
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }
  // Generate JWT token
  const token = user.generateAuthToken();
  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
    })
  );
});

export const getUserWithRoleDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await User.find({ role: "delivery_partner" }).select(
      "-password"
    );
    if (!users || users.length === 0) {
      throw new ApiError(404, "No delivery partners found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, users, "Delivery partners fetched successfully")
      );
  }
);

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  }
);
