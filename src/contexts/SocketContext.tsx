/**
 * SocketContext
 *
 * One shared Socket.IO connection for the whole app, used by both chat
 * (direct messages + hub channel) and real-time notifications - so we
 * don't open two separate connections for two features that both need
 * the same authenticated real-time channel.
 *
 * Authenticates via `auth: { token }` on connect, matching the backend's
 * JWT verification in socketio.ts (io.use(...)). Connects only while the
 * user is actually authenticated, and disconnects on logout.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { API_BASE_URL } from "../config/env";

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
});

const SOCKET_URL = API_BASE_URL;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setSocket(null);
      setConnected(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setConnected(false);
      return;
    }

    const instance = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    instance.on("connect", () => setConnected(true));
    instance.on("disconnect", () => setConnected(false));
    instance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setConnected(false);
    });

    setSocket(instance);

    return () => {
      instance.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => useContext(SocketContext);
