import React, { createContext, useContext } from "react";
import { message } from "antd";

type NotificationContextType = {
  notifySuccess: (msg: string) => void;
  notifyError: (msg: string) => void;
  notifyInfo: (msg: string) => void;
  notifyWarning: (msg: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const notifySuccess = (msg: string) => messageApi.success(msg);
  const notifyError = (msg: string) => messageApi.error(msg);
  const notifyInfo = (msg: string) => messageApi.info(msg);
  const notifyWarning = (msg: string) => messageApi.warning(msg);

  return (
    <NotificationContext.Provider
      value={{ notifySuccess, notifyError, notifyInfo, notifyWarning }}
    >
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
