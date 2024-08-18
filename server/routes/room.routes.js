import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { createRoom, getRooms } from "../controllers/RoomController.js";

const RoomRoutes = Router();
RoomRoutes.post("/create-room", verifyToken, createRoom);
RoomRoutes.get("/get-rooms", verifyToken, getRooms);
export default RoomRoutes;
