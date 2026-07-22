import mongoose from "mongoose";

const cardScheema = new mongoose.Schema(
  {
    user: { type: String, trim: true, required: true },
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
    },
    question: { type: String, trim: true, maxLength: 255, required: true },
    answer: { type: String, trim: true, maxLength: 255, required: true },
    options: { type: Array, maxLength: 4, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Card = mongoose.model("Card", cardScheema);
