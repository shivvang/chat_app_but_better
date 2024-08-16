import Message from "../models/message.model.js";
import mongoose from "mongoose";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).json({ error: "Both user IDs are required." });
    }

    // Check if user1 and user2 are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(user2)) {
      return res.status(400).json({ error: "Invalid recipient user ID." });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found." });
    }

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
