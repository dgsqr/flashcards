import express from "express";
import mongoose from "mongoose";
import { Card } from "../models/Card.js";
import rateLimit from "express-rate-limit";

export const newCard = express.Router();
export const getCards = express.Router();
export const deleteCard = express.Router();
export const editCard = express.Router();

/* creates a new card */
newCard.post(
  "/",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 30,
    message: "You are creating too many cards. Try to create more later",
  }),
  async (req, res) => {
    /*
    {
        deckId: ObjectID
        question: "What's the capital of Brazil?",
        answer: "Brasilia",
        options: ["Brasilia", "Rio de Janeiro", "São Paulo"],
        difficulty: "medium",
    }
  */

    const question = req.body.question?.trim() || "";
    const deckId = new mongoose.Types.ObjectId(req.body.deckId) || "";
    const answer = req.body.answer?.trim() || "";
    const options = req.body.options || [];
    const difficulty = req.body.difficulty?.toLowerCase() || "";

    if (!mongoose.Types.ObjectId.isValid(deckId))
      return res.status(400).json({
        message: "Invalid deck id.",
      });

    if (!question || !answer)
      return res.status(400).json({
        message: "Please, enter a valid question or answer.",
      });

    if (question.length > 255 || answer.length > 255)
      return res.status(400).json({
        message: "Question or answer must be smaller than 255 characters.",
      });

    if (options.length === 0)
      return res.status(400).json({
        message: "Please, enter valid options.",
      });

    if (options.length > 4)
      return res.status(400).json({
        message: "Options must be shorter or equal to 4 elements.",
      });

    if (
      difficulty !== "easy" &&
      difficulty !== "medium" &&
      difficulty !== "hard"
    )
      return res.status(400).json({
        message:
          "Please, enter a valid difficulty value. ( easy, medium or hard )",
      });

    const newCard = {
      user: req.cookies.user.user_id,
      deckId: deckId,
      question: question,
      answer: answer,
      options: options,
      difficulty: difficulty,
    };

    try {
      const card = await Card.create(newCard);
      res.status(201).send({ message: "New card added.", content: card });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error." });
    }
  },
);

/* get all authenticated user cards */
getCards.get("/", async (req, res) => {
  try {
    const { user_id } = req.cookies.user;
    const cards = await Card.find({ user: user_id });
    res.status(200).send(cards);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error." });
  }
});

/* deletes a card */
deleteCard.delete("/:id", async (req, res) => {
  try {
    const card_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(card_id))
      return res.status(400).json({
        message: "Invalid card ID.",
      });

    const cardToDelete = await Card.findOneAndDelete({
      _id: card_id,
      user: req.cookies.user.user_id,
    });

    if (!cardToDelete)
      return res.status(404).json({
        message: "The card that you're trying to delete doesn't exist.",
      });

    res.status(200).json({ message: "Card successfully deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

/* edits a card */
editCard.put("/:id", async (req, res) => {
  try {
    const card_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(card_id))
      return res.status(400).json({
        message: "Invalid card ID.",
      });

    const question = req.body.question?.trim() || "";
    const answer = req.body.answer?.trim() || "";
    const options = req.body.options || [];
    const difficulty = req.body.difficulty?.toLowerCase() || "";

    if (!question || !answer)
      return res.status(400).json({
        message: "Please, enter a valid question or answer.",
      });

    if (question.length > 255 || answer.length > 255)
      return res.status(400).json({
        message: "Question or answer must be smaller than 255 characters.",
      });

    if (options.length === 0)
      return res.status(400).json({
        message: "Please, enter valid options.",
      });

    if (options.length > 4)
      return res.status(400).json({
        message: "Options must be shorter or equal to 4 elements.",
      });

    if (
      difficulty !== "easy" &&
      difficulty !== "medium" &&
      difficulty !== "hard"
    )
      return res.status(400).json({
        message:
          "Please, enter a valid difficulty value. ( easy, medium or hard )",
      });

    const newCard = {
      question: question,
      answer: answer,
      options: options,
      difficulty: difficulty,
    };

    const cardToEdit = await Card.findOneAndUpdate(
      { _id: card_id, user: req.cookies.user.user_id },
      newCard,
      {
        new: true,
      },
    );

    if (!cardToEdit)
      return res.status(404).json({
        message: "The card that you're trying to edit doesn't exist.",
      });

    res.status(201).json({ message: "Card successfully edited." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});
