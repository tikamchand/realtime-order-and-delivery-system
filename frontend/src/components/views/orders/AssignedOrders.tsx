import { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/apiRequest";
import { IOrder } from "./UnassignedOrders";
import { Button, Card, Tag, Typography, Select } from "antd";
import socket from "../../../utils/socket";
import { useAuth } from "../../../context/AuthContext";

const { Text } = Typography;
const ORDER_STATUS = ["pending", "picked-up", "on-the-way", "delivered"];
interface fetchAssignedOrdersResponse {
  data: Array<IOrder>;
}

const AssignedOrders = () => {
  const [orders, setOrders] = useState<fetchAssignedOrdersResponse | null>(
    null
  );
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>(
    {}
  );
  const fetchAssignedOrders = async () => {
    try {
      const response = await apiRequest<fetchAssignedOrdersResponse>(
        "GET",
        "/orders/assigned",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching assigned orders:", error);
    }
  };
  const handleStatusChange = (orderId: string, value: string) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const handleUpdateStatus = (orderId: string) => {
    const status = selectedStatus[orderId];
    if (!status) return;
    const deliveryPartnerId = user?._id;
    if (!deliveryPartnerId) {
      console.log(user);
      console.error("Partner ID is not available");
      return;
    }
    socket.emit("update_status", { orderId, deliveryPartnerId, status });
    fetchAssignedOrders();
    console.log(`Sent status update for order ${orderId}: ${status}`);
  };
  useEffect(() => {
    fetchAssignedOrders();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg  font-semibold">Assigned Orders</h1>
      {/* Add logic to display assigned orders here */}
      {orders?.data.length === 0 ? (
        <p>No Assigned Orders Found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
              {order.delivery_status !== "delivered" && (
                <>
                  <Select
                    defaultValue=""
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusChange(order._id, value)}
                    options={ORDER_STATUS.map((status) => ({
                      value: status,
                      label: status.charAt(0).toUpperCase() + status.slice(1),
                    }))}
                  />
                  <Button
                    type="primary"
                    className="ml-2"
                    onClick={() => handleUpdateStatus(order._id)}
                  >
                    Update Status
                  </Button>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;
