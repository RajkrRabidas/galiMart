import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({children}) => {
    const { isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const nextSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
            auth: {
                token: localStorage.getItem("token") || localStorage.getItem("access_token")
            },
            withCredentials: true,
            reconnection: false,
            transports: ["websocket"]
        });

        nextSocket.on("connect", () => {
            setSocket(nextSocket);
            console.log("Connected to socket server");
        });

        nextSocket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });

        nextSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            nextSocket.disconnect();
        });

        return () => {
            nextSocket.disconnect();
            setSocket(null);
        }
    }, [isAuthenticated])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);
