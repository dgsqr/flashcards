import express from "express";
import mongoose from "mongoose";
import { Deck } from "../models/Deck.js";
import { Card } from "../models/Card.js";
import rateLimit from "express-rate-limit";

export const createDeck = express.Router();
export const deleteDeck = express.Router();
export const getDecks = express.Router();
export const getDeck = express.Router();
export const editDeck = express.Router();

createDeck.post(
  "/",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    message: "You are creating too many decks. Try to create more later",
  }),
  async (req, res) => {
    try {
      const deckName = req.body.deckName?.trim() || "";
      const user = req.cookies.user.user_id;

      if (!deckName)
        return res
          .status(400)
          .json({ message: "Please, enter a valid deck name." });

      if (deckName.length > 50)
        return res
          .status(400)
          .json({ message: "Deck's name can't be longer than 50 characters." });

      const deck = await Deck.create({
        deckName: deckName,
        user: user,
      });

      res
        .status(201)
        .json({ message: "Deck created successfully!", content: deck });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        res.status(409).json({
          message: "Deck's name already being used. Choose another one.",
        });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  },
);

editDeck.put("/:id", async (req, res) => {
  try {
    const deckId = req.params.id || "";
    const deckName = req.body.deckName.trim() || "";
    const user = req.cookies.user.user_id;

    if (!deckId)
      return res
        .status(400)
        .json({ message: "Please, enter a valid deck ID." });

    if (deckName.length > 50)
      return res
        .status(400)
        .json({ message: "Deck's name can't be longer than 50 characters." });

    const deck = await Deck.findOneAndUpdate(
      { _id: deckId, user: user },
      {
        deckName: deckName,
      },
      {
        new: true,
      },
    );

    res
      .status(201)
      .json({ message: "Deck updated successfully!", content: deck });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(409).json({
        message: "Deck's name already being used. Choose another one.",
      });
    } else {
      res.status(500).json({ message: "Internal server error." });
    }
  }
});

deleteDeck.delete("/:id", async (req, res) => {
  try {
    const user = req.cookies.user.user_id;
    const deckId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deckId))
      return res.status(400).json({
        message: "Invalid deck id.",
      });

    const deck = await Deck.findByIdAndDelete(deckId);

    if (!deck || deck.length === 0)
      return res.status(404).json({
        message: "Deck not found.",
      });

    const cards = await Card.deleteMany({ deckId: deckId, user: user });

    return res.status(200).json({ message: "Deck successfully deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

getDecks.get("/", async (req, res) => {
  try {
    const user = new mongoose.Types.ObjectId(req.cookies.user.user_id);

    const decks = await Deck.aggregate([
      {
        $match: { user: user },
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

    if (!decks || decks.length === 0)
      return res
        .status(404)
        .json({ message: "You don't have any deck created yet." });

    return res.status(200).send(decks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

getDeck.get("/:id", async (req, res) => {
  try {
    const user = req.cookies.user.user_id;
    const deckId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deckId))
      return res.status(400).json({
        message: "Invalid deck id.",
      });

    const deck = await Deck.findOne({ user: user, _id: deckId });

    if (!deck || deck.length === 0)
      return res.status(404).json({
        message: "Deck not found.",
      });

    const cards = await Card.find({ user: user, deckId: deckId });

    return res.status(200).json({ deck: deck.deckName, cards: [...cards] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});
