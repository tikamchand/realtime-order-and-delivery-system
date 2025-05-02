import React from "react";
import { Card, Empty, List, Tag, Typography } from "antd"; // Import your interface from the correct file
import { fetchOrdersResponse } from "./Orders";

const { Title, Text } = Typography;

interface OrdersProps {
  ordersData: fetchOrdersResponse["data"];
}

const OrderList: React.FC<OrdersProps> = ({ ordersData }) => {
  const { orders, orderItems } = ordersData;

  // Match orderItems by order _id
  const getItemsByOrderId = (orderId: string) => {
    return orderItems.find((item) => item._id === orderId)?.items || [];
  };

  return (
    <div style={{ padding: 16 }}>
      {orders.length === 0 ? (
        <Empty description="No Orders Found" />
      ) : (
        orders.map((order) => (
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
              <Text strong>Payment:</Text> {order.payment_type.toUpperCase()}{" "}
              {order.isOrderPrepaid && <Tag color="green">Prepaid</Tag>}
            </p>
            <p>
              <Text strong>Address:</Text> {order.delivery_address}
            </p>
            <p>
              <Text strong>Delivery Partner:</Text>{" "}
              {order.isAssignedDeliveryPartner
                ? order.delivery_partner_id
                : "Not Assigned"}
            </p>

            <Title level={5}>Items:</Title>
            <List
              bordered
              dataSource={getItemsByOrderId(order._id)}
              renderItem={(item) => (
                <List.Item key={item.productId}>
                  <div style={{ width: "100%" }}>
                    <Text>
                      <strong>Product ID:</strong> {item.productId}
                    </Text>
                    <br />
                    <Text>
                      <strong>Quantity:</strong> {item.quantity}
                    </Text>
                    <br />
                    <Text>
                      <strong>Price:</strong> ₹{item.price}
                    </Text>
                    <br />
                    <Text>
                      <strong>Product Name:</strong>{" "}
                      {
                        item.productDetails
                          .name /* or actual field from IProduct */
                      }
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        ))
      )}
    </div>
  );
};
export default OrderList;
