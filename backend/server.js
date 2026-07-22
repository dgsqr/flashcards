import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { newCard, getCards, deleteCard, editCard } from "./routes/cards.js";
import { register, login, logout, recover, info } from "./routes/users.js";
import {
  createDeck,
  getDecks,
  getDeck,
  deleteDeck,
  editDeck,
} from "./routes/decks.js";
import { Auth } from "./middlewares/Auth.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.send("Server running...");
});

/* creates a new user */
app.use("/register", register);
/* login route */
app.use("/login", login);
/* user info */
app.use("/info", Auth, info);
/* logout route */
app.use("/logout", logout);
/* recover route */
app.use("/recover", recover);

/* creates new deck */
app.use("/deck", Auth, createDeck);
/* deletes a deck and its cards */
app.use("/deck", Auth, deleteDeck);
/* get all decks */
app.use("/decks", Auth, getDecks);
/* get deck by id */
app.use("/deck", Auth, getDeck);
/* edit deck by id */
app.use("/deck", Auth, editDeck);

/* creates a new card */
app.use("/card", Auth, newCard);
/* get all cards */
app.use("/cards", Auth, getCards);
/* deletes a card */
app.use("/card", Auth, deleteCard);
/* edits a card */
app.use("/card", Auth, editCard);
