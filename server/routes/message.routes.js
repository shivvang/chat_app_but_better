import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { getMessages, uploadFile } from "../controllers/MessageController.js";
import { uploadFiles } from "../middlewares/multerFiles.middleware.js";

const messagesRouter = Router();
messagesRouter.post("/get-messages", verifyToken, getMessages);
// Handle multiple file uploads limit upto 10
messagesRouter.post("/upload-file", uploadFiles, uploadFile);
export default messagesRouter;
