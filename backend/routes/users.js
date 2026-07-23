import express from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Deck } from "../models/Deck.js";
import rateLimit from "express-rate-limit";

export const register = express.Router();
export const login = express.Router();
export const logout = express.Router();
export const recover = express.Router();
export const info = express.Router();

register.post(
  "/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message:
      "You've made too many registration attempts. Please wait a few minutes before trying again.",
  }),
  async (req, res) => {
    /* 
    {
        "username": "your_user",
        "password": "your_password",
        "recovery_code": "your_4_digits_code"
    }
  */
    console.log("Register Attempt from " + req.ip);

    const username = req.body.username?.trim() || "";
    const password = req.body.password?.trim() || "";
    const recoveryCode = req.body.recoveryCode?.toString().trim() || "";

    const usernameLength = /^.{8,16}$/;
    if (!username || usernameLength.test(username))
      return res.status(400).send("Username must be 3-20 characters long.");

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username))
      return res
        .status(400)
        .send("Username can only contain letters, numbers, and underscores.");

    const passwordRegex = /^.{8,16}$/;
    if (!password || !passwordRegex.test(password))
      return res
        .status(400)
        .send("Your password must be 8-16 characters long.");

    const recoveryRegex = /^\d{4}$/;
    if (!recoveryCode || !recoveryRegex.test(recoveryCode))
      return res.status(400).send("Please, enter a valid recovery code.");

    try {
      const user = await User.create({
        username,
        password,
        recoveryCode,
      });
      res
        .status(201)
        .cookie(
          "user",
          { username: user.username, user_id: user._id },
          { httpOnly: true, sameSite: "None", secure: true },
        )
        .json({
          username: user.username,
          createdAt: user.createdAt,
          decks: [],
        });
      console.log("new user registerd: " + user);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).send("Username already taken.");
      } else {
        console.log(error);
        res.status(500).send("Internal server error.");
      }
    }
  },
);

login.post(
  "/",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many failed attempts. Try again later.",
  }),
  async (req, res) => {
    console.log("Login Attempt from " + req.ip);
    try {
      const user = await User.findOne({
        username: req.body.username?.trim(),
        password: req.body.password?.trim(),
      });

      if (!user) return res.status(401).send("Incorrect username or password.");

      const decks = await Deck.aggregate([
        {
          $match: { user: user._id },
        },
        {
          $lookup: {
            from: "cards",
            localField: "_id",
            foreignField: "deckId",
            as: "cards",
          },
        },
        {
          $addFields: {
            cardCount: { $size: "$cards" },
          },
        },
        {
          $project: {
            cards: 0,
          },
        },
      ]);

      res
        .cookie(
          "user",
          { username: user.username, user_id: user._id },
          { httpOnly: true, sameSite: "None", secure: true },
        )
        .json({
          username: user.username,
          createdAt: user.createdAt,
          decks: decks,
        });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  },
);

info.get("/", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.cookies.user.user_id);

    const user = await User.findOne({
      _id: userId,
    });

    if (!user)
      return res.status(401).send("Conflitct between username and user id.");

    const decks = await Deck.aggregate([
      {
        $match: { user: userId },
      },
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "deckId",
          as: "cards",
        },
      },
      {
        $addFields: {
          cardCount: { $size: "$cards" },
        },
      },
      {
        $project: {
          cards: 0,
        },
      },
    ]);

    res.json({
      username: user.username,
      createdAt: user.createdAt,
      decks: decks || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

recover.put(
  "/",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message:
      "You're trying too many times to change password. Try again later.",
  }),
  async (req, res) => {
    console.log("Recovery Attempt from " + req.ip);
    try {
      const password = req.body.password?.trim() || "";
      const recoveryCode = req.body.recoveryCode?.trim() || "";
      const username = req.body.username?.trim() || "";

      const recoveryRegex = /^\d{4}$/;
      if (!recoveryCode || !recoveryRegex.test(recoveryCode))
        return res.status(400).send("Please, enter a valid recovery code.");

      const user = await User.findOneAndUpdate(
        { username: username, recoveryCode: recoveryCode },
        { password: password },
        { new: true },
      );

      if (!user) {
        return res.status(401).send("Invalid username or recovery code.");
      }

      const passwordRegex = /^.{8,16}$/;
      if (!password || !passwordRegex.test(password))
        return res
          .status(400)
          .send("Your password must be 8-16 characters long.");

      return res.status(200).send("Password changed successfully!");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error.");
    }
  },
);

logout.post("/", async (req, res) => {
  res
    .status(200)
    .clearCookie("user", { httpOnly: true, sameSite: "None", secure: true })
    .send("Logged out successfully.");
});
