import { Button } from "antd";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const { setUser, setIsSignedIn, user } = useAuth();

  const customerLinks = [
    { key: "home", label: <Link to="/home">Home</Link> },
    { key: "cart", label: <Link to="/cart">Go to Cart</Link> },
    { key: "orders", label: <Link to="/orders">Go to Orders</Link> },
  ];

  const deliveryPartnerLinks = [
    {
      key: "unassigned",
      label: <Link to="/orders/unassigned">Unassigned Orders</Link>,
    },
    {
      key: "assigned",
      label: <Link to="/orders/assigned">Accepted Orders</Link>,
    },
  ];

  const adminLinks = [
    {
      key: "delivery-partner",
      label: <Link to="/delivery-partner">Delivery Partners</Link>,
    },
    { key: "all-orders", label: <Link to="/orders/all">All Orders</Link> },
  ];

  const renderMenuItems = () => {
    switch (user?.role) {
      case "customer":
        return customerLinks;
      case "delivery_partner":
        return deliveryPartnerLinks;
      case "admin":
        return adminLinks;
      default:
        return [];
    }
  };
  return (
    <>
      <div className="w-full flex justify-center bg-blue-400 p-4">
        <header className="container flex items-center justify-between h-fit ">
          <div className="flex items-center gap-4 w-1/2">
            <Menu mode="horizontal" theme="light" className="w-full">
              {renderMenuItems().map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu>
          </div>
          <Button
            type="primary"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              setIsSignedIn(false);
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </header>
      </div>
    </>
  );
};

export default Navbar;
