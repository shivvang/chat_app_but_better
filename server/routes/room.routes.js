import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import {
  createRoom,
  getRoomMessages,
  getRooms,
} from "../controllers/RoomController.js";

const RoomRoutes = Router();
RoomRoutes.post("/create-room", verifyToken, createRoom);
RoomRoutes.get("/get-rooms", verifyToken, getRooms);
RoomRoutes.get("/get-room-messages/:roomId", verifyToken, getRoomMessages);

export default RoomRoutes;
