const {Server} = require("socket.io")
const jwt = require("jsonwebtoken")

let io = Server ;
const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",

        }
    })

    io.use((socket, next)=> {
        try{
            const token = socket.handshake.auth?.token;

            if(!token){
                return next(new Error("Authentication error"))
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if(!decoded || !decoded.user){
                return next(new Error("Authentication error"))
            }

            socket.data.user = decoded.user;
            next();
        }catch(err){
            console.log(err)
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