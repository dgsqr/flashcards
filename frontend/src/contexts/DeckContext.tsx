import { createContext, useContext, useState } from "react";

interface Cards {
  _id: number;
  question: string;
  answer: string;
  options: string[];
  difficulty: string;
}

export interface Deck {
  deck: string;
  cards: Cards[];
}

interface ContextTypes {
  deck: Deck | null;
  setDeck: React.Dispatch<React.SetStateAction<Deck | null>>;
}

const DeckContext = createContext<ContextTypes | null>(null);

/* const deckMock = {
  deck: "Anatomy",
  cards: [
    {
      _id: 1,
      question: "What organ pumps blood through the body?",
      answer: "Heart",
      options: ["Lungs", "Heart", "Brain", "Liver"],
      difficulty: "easy",
      tags: ["anatomy"],
    },
    {
      _id: 2,
      question: "Which bone protects the brain?",
      answer: "Skull",
      options: ["Rib", "Spine", "Skull", "Pelvis"],
      difficulty: "easy",
      tags: ["anatomy"],
    },
    {
      _id: 3,
      question: "What organ is responsible for breathing?",
      answer: "Lungs",
      options: ["Heart", "Kidneys", "Lungs", "Stomach"],
      difficulty: "easy",
      tags: ["anatomy"],
    },
    {
      _id: 4,
      question: "How many chambers does the human heart have?",
      answer: "4",
      options: ["2", "3", "4", "5"],
      difficulty: "easy",
      tags: ["anatomy"],
    },
    {
      _id: 5,
      question: "Which part of the body connects the head to the torso?",
      answer: "Neck",
      options: ["Arm", "Back", "Neck", "Shoulder"],
      difficulty: "easy",
      tags: ["anatomy"],
    },
  ],
}; */

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeck must be used inside a DeckProvider.");
  }
  return context;
}

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const [deck, setDeck] = useState<Deck | null>(null);

  return (
    <DeckContext.Provider value={{ deck, setDeck }}>
      {children}
    </DeckContext.Provider>
  );
}
