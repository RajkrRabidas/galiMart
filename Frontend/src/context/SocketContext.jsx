import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const getValidSocketToken = async () => {
    const storedToken = localStorage.getItem("token") || localStorage.getItem("access_token");

    if (!storedToken) {
        return null;
    }

    try {
        const base64Payload = storedToken.split(".")[1];
        if (!base64Payload) {
            return storedToken;
        }

        const payload = JSON.parse(atob(base64Payload));
        const expiresAt = Number(payload.exp || 0) * 1000;

        if (expiresAt > Date.now() + 30_000) {
            return storedToken;
        }
    } catch {
        return storedToken;
    }

    try {
        const response = await api.post("/auth/refresh-token");
        const refreshedToken = response?.data?.tokens?.accessToken;

        if (refreshedToken) {
            localStorage.setItem("token", refreshedToken);
            localStorage.removeItem("access_token");
            return refreshedToken;
        }
    } catch (error) {
        console.error("Socket token refresh failed:", error);
    }

    return null;
};

export const SocketProvider = ({children}) => {
    const { isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        let isActive = true;

        const connectSocket = async () => {
            const socketToken = await getValidSocketToken();

            if (!isActive) {
                return;
            }

            const nextSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
                auth: socketToken ? { token: socketToken } : {},
                withCredentials: true,
                reconnection: false,
                transports: ["websocket"]
            });

            nextSocket.on("connect", () => {
                if (!isActive) {
                    nextSocket.disconnect();
                    return;
                }

                setSocket(nextSocket);
                console.log("Connected to socket server");
            });

            nextSocket.on("disconnect", () => {
                console.log("Disconnected from socket server");
            });

            nextSocket.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                nextSocket.disconnect();
                setSocket(null);
            });

            return nextSocket;
        };

        const nextSocket = connectSocket();

        return () => {
            isActive = false;
            if (nextSocket && typeof nextSocket.then === "function") {
                nextSocket.then((socketInstance) => {
                    socketInstance?.disconnect();
                });
                return;
            }

            nextSocket?.disconnect();
            setSocket(null);
        };
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);
