import mongoose from "mongoose";

const deckSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    deckName: {
      type: String,
      trim: true,
      required: true,
      maxLength: 50,
    },
  },
  {
    timestamps: true,
  },
);

export const Deck = mongoose.model("Deck", deckSchema);
