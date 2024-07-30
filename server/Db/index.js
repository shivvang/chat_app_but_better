import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDb = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGO_DB_CONNECTION_URL}/${DB_NAME}`
    );

    console.log(
      `\n MongoDb connected [[DB HOST : ${connectInstance.connection.host}]]`
    );
  } catch (error) {
    console.log("problem occured while connecting to db", error.message);
    process.exit(1);
  }
};

export default connectDb;
