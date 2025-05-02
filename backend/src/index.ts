import "./utils/config.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import { Request, Response, NextFunction } from "express";
import connectDb from "./db/db.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import Order from "./models/order.models.js";
import authRoutes from "./routes/auth/auth.routes.js";
import productRoutes from "./routes/products/products.routes.js";
import orderRoutes from "./routes/orders/order.routes.js";
import cartRoutes from "./routes/carts/cart.routes.js";
import mongoose from "mongoose";
import { socketAuthMiddleware } from "./middleware/socket-auth.middleware.js";
import { ApiError } from "./utils/ApiError.js";

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
  },
});

app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Socket.io middleware for authentication
io.use(socketAuthMiddleware);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_user_room", (userId: string) => {
    socket.join(`order/user/${userId}`);
    console.log(`User ${userId} joined room order/user/${userId}`);
  });
  socket.on("join_admin_room", () => {
    socket.join(`order/admin/all`);
    console.log(`admin joined room order/admin/all`);
  });
  // Delivery partner accepts order
  socket.on(
    "accept_order",
    async (props: { orderId: string; partnerId: string }) => {
      console.log(props);
      const { orderId, partnerId } = props;
      const order = await Order.findUnassignedOrderByOrderId(orderId);
      if (order && !order.delivery_partner_id) {
        order.delivery_partner_id = new mongoose.Types.ObjectId(partnerId);
        order.delivery_status = "picked-up";
        order.isAssignedDeliveryPartner = true;
        order.save();
        // Notify delivery partner
        socket.emit("order_assigned_success", order);

        // Notify others in accepts room
        socket.to("order/accepts").emit("order_already_assigned", {
          orderId,
          assignedTo: partnerId,
        });

        // Notify customer in order room
        io.to(`order/${orderId}`).emit("order_update", order);
        io.to(`order/admin/all`).emit("order_update", order);
      } else {
        socket.emit("order_assign_failed", "Order already assigned");
      }
    }
  );

  // Update order status (from delivery partner)
  socket.on("update_status", async ({ orderId, deliveryPartnerId, status }) => {
    console.log(orderId, deliveryPartnerId, status);
    try {
      const order = await Order.updateOrderDeliveryStatus(
        orderId,
        deliveryPartnerId,
        status
      );
      if (order) {
        const userId = order.userId.toString(); // adjust if it's stored differently
        io.to(`order/user/${userId}`).emit("order_status_updated", {
          orderId,
          status,
        });
        io.to(`order/admin/all`).emit("order_update", {
          orderId,
          status,
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      socket.emit("order_update_failed", "Failed to update order status");
    }
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);

// common error handling middleware
app.use(
  (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  }
);

server.listen(PORT, () => {
  connectDb();

  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});
