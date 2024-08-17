import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { createRoom } from "../controllers/RoomController.js";

const RoomRoutes = Router();
RoomRoutes.post("/create-room", verifyToken, createRoom);
export default RoomRoutes;
