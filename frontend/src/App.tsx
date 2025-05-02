import { useEffect } from "react";
import "./App.css";
import Router from "./Router";
import socket from "./utils/socket";

function App() {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Router /> 
    </>
  );
}

export default App;
