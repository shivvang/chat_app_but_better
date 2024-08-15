import { Server as socketIoServer } from "socket.io";
const socketSetup = (server) => {
  const io = new socketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();
  const disconnect = (socket) => {
    console.log(`client disconnected ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected ${userId} with socket Id ${socket.id}`);
    } else {
      console.log("user id not provided in here");
    }
  });

  io.on("disconnect", (socket) => {
    disconnect(socket);
  });
};
export default socketSetup;
