import type { FormProps } from "antd";
import { Button, Form, Input, Card, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/apiRequest";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";

type FieldType = {
  name?: string;
  password?: string;
  email?: string;
  role?: boolean;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Register = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await apiRequest("POST", "/auth/register", {
        role: values.role ? "delivery_partner" : "customer",
        name: values.name,
        email: values.email,
        password: values.password,
      });

      notifySuccess("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      notifyError((error as Error)?.message);
      console.error("Failed to register user:", error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      navigate("/home");
    }
  }, [isSignedIn, navigate]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card style={{ width: 600 }} title="Register">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item<FieldType>
            name="role"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Register as Delivery partner</Checkbox>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-between">
          <Button type="link" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
