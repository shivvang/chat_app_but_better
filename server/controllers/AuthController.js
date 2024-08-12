import { compare } from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

    res.cookie("access_Token", createToken(email), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: { id: user.id, email: user.email, userName: user.userName },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal server error");
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userDetails = await User.findOne(req.email);
    if (!userDetails) return res.status(404).send("user not found");

    return res.status(200).json({
      user: {
        id: userDetails.id,
        email: userDetails.email,
        userName: userDetails.userName,
      },
    });
  } catch (error) {
    console.log({ error });
  }
};

export const updatePass = async (req, res, next) => {
  const { email } = req;
  const { password } = req.body;
  if (!password) return res.status(400).send("pass is required");

  const user = await User.findOneAndUpdate(email, { password });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
  });
};

export const addProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file.path) return res.status(400).send("file is required");
    const pfpLocalPath = req.file.path;
    const pfp = await uploadOnCloudinary(pfpLocalPath);

    //check if file upload is done or not because it is required field  db will definately break
    if (!pfp) {
      return res.status(404).send("there was trouble uploading   your file");
    }
    const updateUser = await User.findOneAndUpdate(
      { email: req.email },
      { pfp: pfp?.url },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      user: {
        id: updateUser.id,
        email: updateUser.email,
        userName: updateUser.userName,
        pfp: updateUser.pfp,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal server error");
  }
};

export const deleteProfilePhoto = async () => {};
