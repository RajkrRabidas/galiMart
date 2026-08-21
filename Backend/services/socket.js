const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const ShopModel = require("../models/shop.model");

let io = null;

const getCookie = (cookieHeader, name) => {
    if (!cookieHeader) {
        return null;
    }

    const cookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
};

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true,
        }
    })

    io.use(async (socket, next)=> {
        try{
            const token = socket.handshake.auth?.token ||
                getCookie(socket.handshake.headers.cookie, "access_token");

            if(!token){
                return next(new Error("Authentication error"))
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded || (!decoded.user && !decoded.id)) {
                return next(new Error("Authentication error"))
            }

            socket.data.user = decoded.user || { _id: decoded.id };

            // Login tokens contain the user id, but not the seller's shop id.
            // Resolve the shop here so seller sockets can receive shop-scoped events.
            if (!socket.data.user.shopId && socket.data.user._id) {
                const shop = await ShopModel.findOne({ ownerId: socket.data.user._id }).select("_id");
                if (shop) {
                    socket.data.user.shopId = shop._id.toString();
                }
            }

            next();
        }catch(err){
            console.log("Socket connection failed",err)
            next(new Error("Authentication error"))
        }
    })

    io.on("connection" , (socket) => {
        const user = socket.data.user;

        if(!user){
            socket.disconnect();
            return;
        }

        const userId = user._id;

        socket.join(`user:${userId}`);

        if(user.shopId){
            socket.join(`shop:${user.shopId}`);
        }

        console.log(`User connected ${userId}`);
        console.log("Socket room: ", [...socket.rooms]);

        socket.on("disconnect", () => {
            console.log(`User disconnected ${userId}`);
        });
    });

    return io;
}

const getIO = () => {
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
}

module.exports = {initSocket, getIO}