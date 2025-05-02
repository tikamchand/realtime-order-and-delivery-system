import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../../utils/apiRequest";
import { IProduct } from "../../../utils/types";
import OrdersList from "./OrderList";
import { IOrder } from "./UnassignedOrders";
import { useAuth } from "../../../context/AuthContext";
import socket from "../../../utils/socket";

export interface fetchOrdersResponse {
  data: {
    orders: Array<IOrder>;
    orderItems: Array<{
      _id: string;
      items: Array<{
        productId: string;
        quantity: number;
        price: number;
        productDetails: IProduct;
      }>;
    }>;
  };
}

const Orders = () => {
  const [orderItems, setOrderItems] = useState<fetchOrdersResponse | null>();
  const { user } = useAuth();
  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiRequest<fetchOrdersResponse>(
        "GET",
        "/orders/user",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrderItems(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, []);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  useEffect(() => {
    socket.emit("join_user_room", user?._id);

    return () => {
      socket.emit("leave_user_room", user?._id); // optional cleanup
    };
  }, [user]);
  useEffect(() => {
    socket.on("order_status_updated", fetchOrders);

    return () => {
      socket.off("order_status_updated", fetchOrders);
    };
  }, [fetchOrders]);
  return (
    <div className="container mx-auto p-4">
      {orderItems?.data && <OrdersList ordersData={orderItems.data} />}
    </div>
  );
};

export default Orders;
