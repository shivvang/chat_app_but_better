import { Router } from "express";
import {
  getUserDetails,
  login,
  signup,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/Auth.middleware.js";
const authRoutes = Router();
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userDetails", verifyToken, getUserDetails);
export default authRoutes;
