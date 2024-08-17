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
