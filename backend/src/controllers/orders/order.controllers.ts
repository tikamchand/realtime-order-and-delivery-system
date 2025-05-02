import Order from "../../models/order.models.js";
import OrderItem from "../../models/orderItem.models.js";
import Cart from "../../models/cart.models.js";
import CartItem from "../../models/cartItem.models.js";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import Product from "../../models/product.models.js";

export const createOrder = async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated");
  }
  const { _id: userId } = req.user;
  const { shippingAddress, paymentMethod } = req.body;

  // Check if cart exists for the user
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Check if there are items in the cart
  const cartItems = await CartItem.find({ cartId: cart._id }).populate<{
    productId: { price: number };
  }>({
    path: "productId",
    select: "price",
  });
  if (!cartItems.length) {
    throw new ApiError(404, "No items found in the cart");
  }

  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.quantity * item.productId.price;
  }, 0);

  const order = new Order({
    userId,
    total_price: totalAmount,
    payment_type: paymentMethod,
    isOrderPrepaid: paymentMethod === "online",
    delivery_address: shippingAddress,
  });
  await order.save();

  // Create order items
  const orderItems = cartItems.map((item) => ({
    orderId: order._id,
    productId: item.productId,
    quantity: item.quantity,
    price: item.productId.price,
  }));
  await OrderItem.insertMany(orderItems);

  // reduct the quantity of the product in the inventory
  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.quantity -= item.quantity;
      await product.save();
    }
  }

  // Clear the cart after creating the order
  await CartItem.deleteMany({ cartId: cart._id });

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("userId");
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new ApiError(500, "Server error");
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("userId").select('-password');
    res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully"));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new ApiError(500, "Server error");
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { delivery_status: status },
      { new: true }
    );
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, order, "Order status updated successfully"));
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new ApiError(500, "Server error");
  }
};

export const getOrdersByUserId = async (req: Request, res: Response) => {
  const user = req.user;
  console.log("fetching orders for the user", user);
  const orders = await Order.find({ userId: user?._id });
  if (!orders.length) {
    throw new ApiError(404, "No orders found for this user");
  }

  const orderItems = await OrderItem.aggregate([
    {
      $match: {
        orderId: { $in: orders.map((order) => order._id) },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $group: {
        _id: "$orderId",
        items: {
          $push: {
            productId: "$productId",
            quantity: "$quantity",
            price: "$price",
            productDetails: "$productDetails",
          },
        },
      },
    },
  ]);

  if (!orderItems.length) {
    throw new ApiError(404, "No order items found for this user");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { orders, orderItems },
        "Orders and order items fetched successfully"
      )
    );
};

export const assignDeliveryPartner = async (req: Request, res: Response) => {
  const { orderId, deliveryPartnerId } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        delivery_partner_id: deliveryPartnerId,
        isAssignedDeliveryPartner: true,
      },
      { new: true }
    );
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, order, "Delivery partner assigned successfully")
      );
  } catch (error) {
    console.error("Error assigning delivery partner:", error);
    throw new ApiError(500, "Server error");
  }
};

export const getUnassignedOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ isAssignedDeliveryPartner: false });
    if (!orders.length) {
      throw new ApiError(404, "No unassigned orders found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, orders, "Unassigned orders fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching unassigned orders:", error);
    throw new ApiError(500, "Server error");
  }
};

export const getOrderByDeliveryPartnerId = async (
  req: Request,
  res: Response
) => {
  const deliveryPartnerId = req.user?._id;
  if (!deliveryPartnerId) {
    throw new ApiError(401, "User not authenticated");
  }

  const orders = await Order.find({
    delivery_partner_id: deliveryPartnerId,
  }).populate("userId");

  if (!orders.length) {
    throw new ApiError(404, "No orders found for this delivery partner");
  }
  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
};
