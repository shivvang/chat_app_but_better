import { Server as socketIoServer } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "socket.io-redis";
import Message from "./models/message.model.js";
import Room from "./models/room.model.js";
import _ from "lodash";
const socketSetup = (server) => {
  const io = new socketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Redis Pub/Sub Setup
  const pubClient = createClient({ url: "redis://localhost:6379" });
  const subClient = pubClient.duplicate();

  // Attach Redis as the adapter for socket.io
  io.adapter(createAdapter(pubClient, subClient));

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
  // The throttle function ensures that the sendMessage and sendRoomMessages functions are not called more than once per second.
  const sendMessage = (message) => {
    const throttledSendMessage = _.throttle(async (message) => {
      try {
        const { sender, recipient } = message;

        // Validate required fields
        if (!sender || !recipient || !message.messageType) {
          throw new Error("Missing required message fields.");
        }

        // Fetch socket IDs for sender and recipient
        const senderSocketId = userSocketMap.get(sender);
        const recipientSocketId = userSocketMap.get(recipient);

        // Create the new message in the database
        const newMessage = await Message.create(message);

        // Populate the message with sender and recipient details
        const populatedMessage = await Message.findById(newMessage._id)
          .populate("sender", "id email userName")
          .populate("recipient", "id email userName");

        // Send the message to the recipient if they are connected
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("recieveMessage", populatedMessage);
        }

        // Send the message to the sender as confirmation
        if (senderSocketId) {
          io.to(senderSocketId).emit("recieveMessage", populatedMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }, 1000); // Throttle to 1 message per second
    throttledSendMessage(message);
  };

  const sendRoomMessages = (message) => {
    const throttledSendMessage = _.throttle(async (message) => {
      try {
        const { sender, roomId, messageType, fileUrl, content } = message;

        // Validate required fields
        if (!sender || !roomId || !messageType) {
          throw new Error("Missing required message fields.");
        }

        // Create new message
        const newMessage = await Message.create({
          sender,
          recipient: null,
          messageType,
          content,
          fileUrl,
        });

        // Fetch the newly created message with sender details
        const populatedMessage = await Message.findById(newMessage._id)
          .populate("sender", "id email userName")
          .exec();

        // Update the room with the new message
        const room = await Room.findByIdAndUpdate(
          roomId,
          { $push: { messages: newMessage._id } },
          { new: true }
        ).populate("members");

        if (!room) {
          throw new Error("Room not found.");
        }

        const messageData = { ...populatedMessage._doc, roomId: room._id };

        // Notify all members of the room
        room.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit("receiveRoomMessage", messageData);
          }
        });

        // Notify the room admin if they have a socket connection
        const adminSocketId = userSocketMap.get(room.admin.toString());
        if (adminSocketId) {
          io.to(adminSocketId).emit("receiveRoomMessage", messageData);
        }
      } catch (error) {
        console.error("Error sending room message:", error.message);
      }
    }, 1000);
    throttledSendMessage(message);
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected ${userId} with socket Id ${socket.id}`);
    } else {
      console.log("user id not provided in here");
    }

    socket.on("sendMessage", sendMessage);

    socket.on("sendRoomMessage", sendRoomMessages);

    socket.on("disconnect", () => disconnect(socket));
  });
};
export default socketSetup;
