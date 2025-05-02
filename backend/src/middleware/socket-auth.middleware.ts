import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: Token required"));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach user to socket for later use
    (socket as any).user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
};
