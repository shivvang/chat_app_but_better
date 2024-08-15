import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { SearchContacts } from "../controllers/ContactsController.js";
const contactRoutes = Router();
contactRoutes.post("/search", verifyToken, SearchContacts);
export default contactRoutes;
