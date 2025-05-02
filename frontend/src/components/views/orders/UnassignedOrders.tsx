import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Button, Empty } from "antd";
import { apiRequest } from "../../../utils/apiRequest";
import { useAuth } from "../../../context/AuthContext";
import socket from "../../../utils/socket";
import { IUser } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const { Text } = Typography;

export interface IOrder {
  _id: string;
  userId: IUser;
  total_price: number;
  delivery_status: "pending" | "picked-up" | "on-the-way" | "delivered";
  payment_type: "online" | "cod";
  isOrderPrepaid: boolean;
  delivery_address: string;
  delivery_partner_id: string | null;
  isAssignedDeliveryPartner: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface fetchOrdersResponse {
  data: Array<IOrder>;
}

const UnassignedOrders: React.FC = () => {
  const [orders, setOrders] = useState<fetchOrdersResponse | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const handleAcceptOrder = async (orderId: string) => {
    const partnerId = user?._id;
    if (!partnerId) {
      console.error("Partner ID is not available");
      return;
    }
    socket.emit("accept_order", { orderId, partnerId });
    socket.on("order_assigned_success", () => {
      notifySuccess("Order has been assigned to you");
      navigate("/orders/assigned");
    });
    socket.on("order_assign_failed", () => {
      notifyError("Order already assign");
      navigate("/orders/assigned");
    });

    console.log("accept_order emitted", { orderId, partnerId });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiRequest<fetchOrdersResponse>(
          "GET",
          "/orders/unassigned",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      {orders?.data.length === 0 ? (
        <Empty description="No Orders Found" />
      ) : (
        <div className="container mx-auto p-4">
          {orders?.data.map((order) => (
            <Card
              key={order._id}
              title={`Order ID: ${order._id}`}
              style={{ marginBottom: 20 }}
              extra={
                <Tag color="blue">{order.delivery_status.toUpperCase()}</Tag>
              }
            >
              <p>
                <Text strong>Total Price:</Text> ₹{order.total_price}
              </p>
              <p>
                <Text strong>Payment Type:</Text>
                {order.payment_type.toUpperCase()}
                {order.isOrderPrepaid && <Tag color="green">Prepaid</Tag>}
              </p>
              <p>
                <Text strong>Address:</Text> {order.delivery_address}
              </p>
              <p>
                <Text strong>Assigned Partner:</Text>
                {order.isAssignedDeliveryPartner
                  ? order.delivery_partner_id
                  : "Not Assigned"}
              </p>
              <Button
                type="primary"
                onClick={() => handleAcceptOrder(order._id)}
              >
                Accept
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnassignedOrders;
