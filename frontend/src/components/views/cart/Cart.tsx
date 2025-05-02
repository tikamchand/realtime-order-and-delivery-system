import { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/apiRequest";
import { IProduct } from "../../../utils/types";
import { Card, Divider, Button, Form, Input, Select } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const { Option } = Select;

type FieldType = {
  shippingAddress?: string;
  paymentMethod?: "cod" | "online";
};

interface FetchCartResponse {
  data: {
    cart: {
      _id: string;
      userId: string;
    };
    cartItems: Array<{
      productId: IProduct;
      quantity: number;
      _id: string;
    }>;
  };
}

const Cart = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [cartItems, setcartItems] = useState<FetchCartResponse["data"] | null>(
    null
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await apiRequest<FetchCartResponse>(
        "POST",
        "/orders",
        { ...values },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      notifySuccess("Order placed succesfully");
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      notifyError((error as Error)?.message);
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await apiRequest<FetchCartResponse>(
          "GET",
          "/carts",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setcartItems(data.data);
        const totalAmount = data.data.cartItems.reduce((total, item) => {
          return total + item.quantity * item.productId.price;
        }, 0);
        setTotalAmount(totalAmount);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {cartItems &&
          cartItems.cartItems.map(
            (item: { productId: IProduct; quantity: number; _id: string }) => (
              <Card
                key={item._id}
                title={item.productId.name}
                style={{ width: 300 }}
                cover={
                  <img
                    alt={item.productId.name}
                    src={item.productId.image_url}
                  />
                }
              >
                <p>{item.productId.price}</p>
                <p>Quantity: {item.quantity}</p>
              </Card>
            )
          )}
      </div>
      <Divider />
      <div className="col-span-3">
        <h2 className="text-xl font-bold">Total Amount: {totalAmount}</h2>
        {!isPlacingOrder && cartItems?.cartItems && (
          <Button type="primary" onClick={() => setIsPlacingOrder(true)}>
            Checkout
          </Button>
        )}
      </div>
      {isPlacingOrder && (
        <div className="container mx-auto p-4 ">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Shipping Address"
              name="shippingAddress"
              rules={[
                {
                  required: true,
                  message: "Please input your shipping address!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Payment Method"
              name="paymentMethod"
              rules={[
                {
                  required: true,
                  message: "Please input your payment method!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                allowClear
              >
                <Option value="cod">COD</Option>
                <Option value="online">Online</Option>
              </Select>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Place Order
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Cart;
