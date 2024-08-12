import { Router } from "express";
import {
  addProfilePhoto,
  deleteProfilePhoto,
  getUserDetails,
  login,
  signup,
  updatePass,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const authRoutes = Router();
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userDetails", verifyToken, getUserDetails);
authRoutes.post("/updatePass", verifyToken, updatePass);
authRoutes.post("/add-pfp", verifyToken, upload.single("pfp"), addProfilePhoto);
authRoutes.post("/remove-pfp", verifyToken, deleteProfilePhoto);
export default authRoutes;
