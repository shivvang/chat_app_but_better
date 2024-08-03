import { compare } from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
const maxAge = 3 * 24 * 60 * 60;

const createToken = (email) => {
  return sign({ email }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password)
      return res.status(400).send("email and password is required");

    const user = await User.create({ userName, email, password });
    res.cookie("access_Token", createToken(email), {
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

export const login = async (req, res, next) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password)
      return res.status(400).send("email and password is required");

    const user = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (!user) res.status(404).send("user not found");

    const ispasscorrect = compare(user.password, password);
    if (!ispasscorrect) res.status(404).send("password is incorrect");

    res.cookie("accesss_token", createToken(email), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      id: user.id,
      email: user.email,
      userName: user.userName,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal server error");
  }
};
