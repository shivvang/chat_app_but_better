import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./Db/Db.js";
import authRoutes from "./routes/Auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import messagesRouter from "./routes/message.routes.js";
import RoomRoutes from "./routes/room.routes.js";
import socketSetup from "./socket.js";

const app = express();
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messagesRouter);
app.use("/api/rooms", RoomRoutes);
connectDb()
  .then(() => {
    app.on("error", (err) => {
      console.log("errr", err);
      throw err;
    });
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
    socketSetup(server);
  })
  .catch((err) => {
    console.log("mongo db connection failed !!", err);
  });
