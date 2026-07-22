import { User } from "../models/User.js";
import mongoose from "mongoose";

export async function Auth(req, res, next) {
  try {
    const userCookies = req.cookies.user;

    if (!userCookies)
      return res
        .status(401)
        .json({ message: "Authorization needed to perform this action" });

    const { username, user_id } = req.cookies.user;

    if (!username || !user_id)
      return res
        .status(401)
        .json({ message: "Authorization needed to perform this action" });

    if (!mongoose.Types.ObjectId.isValid(user_id))
      return res.status(401).json({ message: "Invalid user ID." });

    const validateUser = await User.findOne({
      username: username,
      _id: user_id,
    });

    if (!validateUser)
      return res.status(401).json({ message: "Invalid username or ID." });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
