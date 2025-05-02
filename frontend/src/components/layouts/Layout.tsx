import AppLayout from "./AppLayout";
import React from "react";

interface layoutProps {
  layout: string;
  children: React.JSX.Element;
}
export const Layout = ({ layout, children }: layoutProps) => {
  if (!layout) return <div className="h-full">{children}</div>;
  if (layout === "app") {
    return <AppLayout>{children}</AppLayout>;
  }
  return <div>Layout</div>;
};
