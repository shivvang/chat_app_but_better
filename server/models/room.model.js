import mongoose from "mongoose";
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [{ type: mongoose.Schema.ObjectId, ref: "User", required: true }],
    admin: [{ type: mongoose.Schema.ObjectId, ref: "User", required: true }],
    messages: [
      { type: mongoose.Schema.ObjectId, ref: "Message", required: false },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
