import Navbar from "../ui/navbar/Navbar";
import React from "react";

interface AppLayoutProps {
  children: React.JSX.Element;
}
const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <div className="w-full h-full">
        <Navbar />
      </div>
      <div className="h-full w-full">{children}</div>
    </>
  );
};

export default AppLayout;
