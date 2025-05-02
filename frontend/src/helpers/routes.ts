import React from "react";
import { PathRouteProps } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import CartPage from "../pages/cart/CartPage";
import OrderPage from "../pages/orders/OrderPage";
import UnassignedOrdersPage from "../pages/orders/UnassignedOrdersPage";
import AssignedOrdersPage from "../pages/orders/AssignedOrdersPage";
import DeliveryPartnerPage from "../pages/users/DeliveryPartnerPage";
import AllOrdersPage from "../pages/orders/AllOrdersPage";

export interface Routes {
  Component: () => React.JSX.Element;
  key: string;
  path: PathRouteProps["path"];
  layout?: string;
  isPrivate: boolean;
}

const routes: Routes[] = [
  {
    Component: HomePage,
    key: "HomePage",
    path: "/home",
    isPrivate: false,
    layout: "app",
  },
  {
    Component: RegisterPage,
    key: "registerPage",
    path: "/register",
    isPrivate: false,
  },
  {
    Component: LoginPage,
    key: "loginPage",
    path: "/login",
    isPrivate: false,
  },
  {
    Component: CartPage,
    key: "cartPage",
    path: "/cart",
    isPrivate: true,
    layout: "app",
  },
  {
    Component: OrderPage,
    key: "OrderPage",
    path: "/orders",
    isPrivate: true,
    layout: "app",
  },
  {
    Component: UnassignedOrdersPage,
    key: "UnassignedOrdersPage",
    path: "/orders/unassigned",
    isPrivate: true,
    layout: "app",
  },
  {
    Component: AssignedOrdersPage,
    key: "AssignedOrdersPage",
    path: "/orders/assigned",
    isPrivate: true,
    layout: "app",
  },
  {
    Component: DeliveryPartnerPage,
    key: "DeliveryPartnerPage",
    path: "/delivery-partner",
    isPrivate: true,
    layout: "app",
  },
  {
    Component: AllOrdersPage,
    key: "AllOrdersPage",
    path: "/orders/all",
    isPrivate: true,
    layout: "app",
  },
];
export default routes;
