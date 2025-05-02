import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../../utils/apiRequest";
import { Table, Tag } from "antd";
import { IOrder } from "./UnassignedOrders";
import socket from "../../../utils/socket";

const columns = [
  {
    title: "Customer Name",
    dataIndex: ["userId", "name"],
    key: "customerName",
  },
  {
    title: "Partner ID",
    dataIndex: "delivery_partner_id",
    key: "partnerId",
  },
  {
    title: "Total Price",
    dataIndex: "total_price",
    key: "totalPrice",
    render: (price: number) => `₹${price}`,
  },
  {
    title: "Delivery Status",
    dataIndex: "delivery_status",
    key: "deliveryStatus",
    render: (status: string) => <Tag color="blue">{status}</Tag>,
  },
  {
    title: "Prepaid?",
    dataIndex: "isOrderPrepaid",
    key: "prepaid",
    render: (isPrepaid: boolean) =>
      isPrepaid ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
  },
  {
    title: "Address",
    dataIndex: "delivery_address",
    key: "address",
  },
];

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState<{ data: Array<IOrder> | null }>();
  const fetchData = useCallback(async () => {
    try {
      const response = await apiRequest<{ data: Array<IOrder> }>(
        "GET",
        "/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAllOrders(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    socket.emit("join_admin_room");

    return () => {
      socket.emit("leave_admin_room"); // optional cleanup
    };
  }, []);
  useEffect(() => {
    socket.on("order_update", fetchData);

    return () => {
      socket.off("order_status_updated", fetchData);
    };
  }, [fetchData]);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-semibold mb-2.5">All orders</h1>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={allOrders?.data || []}
        pagination={false}
      />
    </div>
  );
};

export default AllOrders;
