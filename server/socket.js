import { Server as socketIoServer } from "socket.io";
import Message from "./models/message.model.js";
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

  const SendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const messageBeingShared = await Message.create(message);

    console.log("stuff is in here", messageBeingShared);

    const messageDataToBeShared = await Message.findById(messageBeingShared._id)
      .populate("sender", "id email userName")
      .populate("recipient", "id email userName");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage", messageDataToBeShared);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageDataToBeShared);
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

    socket.on("sendMessage", SendMessage);

    socket.on("disconnect", () => disconnect(socket));
  });
};
export default socketSetup;
