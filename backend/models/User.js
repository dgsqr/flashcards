import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
      match: /^[a-zA-Z0-9_]+$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 16,
      trim: true,
    },
    recoveryCode: {
      type: String,
      required: true,
      match: /^\d{4}$/,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
