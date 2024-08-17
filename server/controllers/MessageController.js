import Message from "../models/message.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";

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

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) {
        uploadedFiles.push(result.url); // Store the Cloudinary URL
      }
    }

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles, //   array of file URLs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
