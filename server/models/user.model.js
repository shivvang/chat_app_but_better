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
    unique: true,
  },
  pfp: {
    type: String,
    required: false,
    default: "",
  },
});

const saltRounds = 10;
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await genSalt(saltRounds);
      this.password = await hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
});

const User = mongoose.model("User", userSchema);
export default User;
