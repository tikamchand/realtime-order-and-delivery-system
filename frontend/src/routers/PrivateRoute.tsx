import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: React.JSX.Element;
}
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isSignedIn: signedIn } = useAuth();
  const location = useLocation();

  return signedIn ? (
    children
  ) : (
    <Navigate to={"/login"} state={location.pathname} />
  );
};
