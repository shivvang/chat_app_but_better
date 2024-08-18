import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const createRoom = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const adminId = req.userId;

    // Ensure the admin exists
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Validate member IDs
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: "Invalid members found" });
    }

    const newRoom = new Room({
      name,
      members,
      admin: adminId,
    });

    await newRoom.save();

    return res.status(201).json({ room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const adminId = req.userId;

    if (!adminId) {
      return res
        .status(400)
        .json({ message: "User ID is missing from request." });
    }

    // Fetch rooms where the user is either an admin or a member
    const rooms = await Room.find({
      $or: [{ admin: adminId }, { members: adminId }],
    }).sort({ updatedAt: -1 });

    // Ensure that rooms is an array
    if (!Array.isArray(rooms) || rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found for the user." });
    }

    return res.status(200).json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);

    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      error: error.message || "Unknown error",
    });
  }
};

export const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ message: "Room ID is required." });
  }

  try {
    // Fetch the room and populate the messages and sender details
    const room = await Room.findById(roomId)
      .populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "id userName email",
        },
      })
      .exec();

    // Check if the room exists
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Return the messages
    return res.status(200).json({ messages: room.messages });
  } catch (error) {
    console.error("Error fetching room messages:", error.message);

    // Return a generic error message to the client
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      error: error.message || "Unknown error",
    });
  }
};
