// src/socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
  transports: ["websocket"],
  autoConnect: true, // you can control when to connect
});

export default socket;
