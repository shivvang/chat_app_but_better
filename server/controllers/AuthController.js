import { compare } from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/uploadpfptoCLoudinary.js";
import { deleteImageFromCloudinary } from "../utils/deleteImageFromCLoudinary.js";
const { sign } = jwt;
const maxAge = 3 * 24 * 60 * 60;

const createToken = (email) => {
  return sign({ email }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
      return res
        .status(400)
        .json({ message: "Email, password, and username are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const user = await User.create({ userName, email, password });
    res.cookie("access_Token", createToken(email), {
      maxAge,
      secure: true,
      sameSite: "None",
      httpOnly: true,
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
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        pfp: user.pfp,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal server error");
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { email } = req;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    const userDetails = await User.findOne({ email });
    if (!userDetails) return res.status(404).send("user not found");

    return res.status(200).json({
      user: {
        id: userDetails.id,
        email: userDetails.email,
        userName: userDetails.userName,
        pfp: userDetails.pfp,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    console.log({ error });
  }
};

export const updatePass = async (req, res, next) => {
  try {
    const { email } = req;
    const { password } = req.body;
    if (!password) return res.status(400).send("pass is required");

    const user = await User.findOneAndUpdate({ email }, { password });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        pfp: user.pfp,
      },
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send("Internal server error");
  }
};

export const addProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).send("File is required");
    }

    const pfpLocalPath = req.file.path;
    const pfp = await uploadOnCloudinary(pfpLocalPath);

    //check if file upload is done or not because it is required field  db will definately break
    if (!pfp || !pfp.url) {
      unlinkSync(pfpLocalPath);
      return res.status(500).send("There was trouble uploading your file");
    }

    const updateUser = await User.findOneAndUpdate(
      { email: req.email },
      { pfp: pfp.url },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      unlinkSync(pfpLocalPath);
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      user: {
        id: updateUser.id,
        email: updateUser.email,
        userName: updateUser.userName,
        pfp: updateUser.pfp,
      },
    });
  } catch (error) {
    console.error("Error adding profile photo:", error);
    return res.status(500).send("internal server error");
  }
};

const extractPublicIdFromUrl = (url) => {
  const urlParts = url.split("/");
  const fileName = urlParts[urlParts.length - 1];
  return fileName.split(".")[0];
};

export const deleteProfilePhoto = async (req, res, next) => {
  const { email } = req;
  if (!email) {
    return res.status(400).send("It looks like your cookies have expired");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("user not found");

    const publicId = extractPublicIdFromUrl(user.pfp);

    if (!publicId) {
      return res.status(400).send("Invalid profile photo URL");
    }

    const deleteResult = await deleteImageFromCloudinary(publicId);

    if (deleteResult.result !== "ok") {
      return res.status(500).send("Failed to delete image from Cloudinary");
    }

    user.pfp = "";
    await user.save();

    return res.status(204).json({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    return res.status(500).send("internal server error");
  }
};

export const logOut = async (req, res, next) => {
  try {
    // Check the cookie exists before clearing
    const token = req.cookies.access_Token;
    if (!token) {
      return res.status(400).send("No active session found.");
    }

    // Clear  access token cookie

    res.clearCookie("access_Token", {
      secure: true,
      sameSite: "None",
      httpOnly: true, // Ensures cookie is not accessible via client-side JS
    });

    return res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal server error during logout");
  }
};
