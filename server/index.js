import dotenv from "dotenv";
dotenv.config();

import cluster from "cluster";
import os from "os";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./Db/Db.js";
import authRoutes from "./routes/Auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import messagesRouter from "./routes/message.routes.js";
import RoomRoutes from "./routes/room.routes.js";
import socketSetup from "./socket.js";
import {
  generalLimiter,
  userLimiter,
} from "./middlewares/configureRateLImiting.js";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers based on the number of CPUs
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exits
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Starting a new one.`);
    cluster.fork();
  });
} else {
  // Worker processes have their own instance of the app
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
  //will limit all requests to all the routes under this  endpoint
  app.use("/api/", generalLimiter);
  // specific limiter to messages routes
  app.use("/api/messages", messageLimiter);
  // specific limiter to control no of user
  app.use("/api/auth", userLimiter);

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
}
