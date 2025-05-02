import { Button, Form, Input, Card } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/apiRequest";
import { IUser } from "../../../utils/types";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useMemo } from "react";
import { useNotification } from "../../../context/NotificationContext";

interface ILoginResponse {
  data: {
    token: string;
    user: IUser;
    message: string;
  };
}

type FieldType = {
  email?: string;
  password?: string;
};

const Login = () => {
  const { setUser, setIsSignedIn, user } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const roleBasedRedirect = useMemo<Record<string, string>>(
    () => ({
      customer: "/home",
      delivery_partner: "/orders/assigned",
      admin: "/delivery-partner",
    }),
    []
  );
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const data = await apiRequest<ILoginResponse>(
        "POST",
        "/auth/login",
        values
      );
      localStorage.setItem("token", data.data.token);
      setUser(data.data.user);
      setIsSignedIn(true);
      notifySuccess("Login successful!");
      navigate(roleBasedRedirect[data.data.user.role]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      notifyError((error as Error)?.message);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(roleBasedRedirect[user?.role ?? "customer"]);
    }
  }, [navigate, user, roleBasedRedirect]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card title="Login" style={{ width: 600 }}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-between">
          <Button type="link" onClick={() => navigate("/register")}>
            Don't have an account? Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
