import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is Required"],
  },

  userName: {
    type: String,
    required: false,
  },
  pfp: {
    type: String,
    required: false,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.passoword = await hash(this.passoword, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
