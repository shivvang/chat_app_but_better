import { Router } from "express";
import {
  addProfilePhoto,
  deleteProfilePhoto,
  getUserDetails,
  login,
  logOut,
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
authRoutes.delete("/remove-pfp", verifyToken, deleteProfilePhoto);
authRoutes.post("/logout", logOut);
export default authRoutes;
