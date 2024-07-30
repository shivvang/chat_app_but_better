import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDb from "./Db/index.js";

const app = express();
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

connectDb()
  .then(() => {
    app.on("error", (err) => {
      console.log("errr", err);
      throw err;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongo db connection failed !!", err);
  });
