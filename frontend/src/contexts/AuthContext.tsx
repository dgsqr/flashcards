import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  username: String;
  createdAt: Date;
  decks: Decks[];
}

export interface Decks {
  _id: string;
  user: String;
  deckName: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  cardCount: number;
}

interface ContextTypes {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  decks: Decks[] | null;
  setDecks: React.Dispatch<React.SetStateAction<Decks[] | null>>;
  loading: boolean;
}

/* const decksMock = [
  {
    _id: "6a28c84f42338562dd23c45b",
    user: "6a1f11f5e0d6cad323bc1392",
    deckName: "Geography",
    createdAt: "2026-06-10T02:13:35.120Z",
    updatedAt: "2026-06-10T02:13:35.120Z",
    __v: 0,
  },
  {
    _id: "6a28c93bc27bf7572ca9e642",
    user: "6a1f11f5e0d6cad323bc1392",
    deckName: "History",
    createdAt: "2026-06-10T02:17:31.647Z",
    updatedAt: "2026-06-10T02:17:31.647Z",
    __v: 0,
  },
  {
    _id: "6a28d60ca81e0a78e2461cf3",
    user: "6a1f11f5e0d6cad323bc1392",
    deckName: "Space",
    createdAt: "2026-06-10T03:12:12.480Z",
    updatedAt: "2026-06-10T03:12:12.480Z",
    __v: 0,
  },
];

const userMock = {
  username: "drizer",
  createdAt: "2026-06-02T17:25:09.148+00:00",
}; */

export const UserContext = createContext<ContextTypes | null>(null);

export function useAuth() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used inside a UserProvider.");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | User>(null);
  const [decks, setDecks] = useState<null | Decks[]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/info`,
          {
            withCredentials: true,
          },
        );

        if (!user && response.data) {
          setUser(response.data);
        }
      } catch (error: any) {
        console.log(error.response);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (!user) getUser();

    if (user) setDecks(user.decks);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, decks, setDecks, loading }}>
      {children}
    </UserContext.Provider>
  );
}
