import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { getMessages } from "../controllers/MessageController.js";

const messagesRouter = Router();

messagesRouter.post("/get-messages", verifyToken, getMessages);

export default messagesRouter;
