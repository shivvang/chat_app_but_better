import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, password) => {
  return sign({ email, password }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password)
      return res.status(400).send("email and password is required");

    const user = User.create({ userName, email, password });
    res.cookie("access_Token", createToken({ email, password }), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    console.log("user", user);
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal server error");
  }
};
