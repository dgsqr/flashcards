import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDeck } from "../contexts/DeckContext";
import { useEffect, useState } from "react";
import type { Decks } from "../contexts/AuthContext";
import axios from "axios";

export default function Profile() {
  const { user, decks, loading } = useAuth();
  const { setDeck } = useDeck();
  const navigate = useNavigate();

  const [displayDecks, setDisplayDecks] = useState<Decks[] | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  async function getDeck(deckId: String | string) {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/deck/${deckId}`,
        {
          withCredentials: true,
        },
      );
      setDeck(data);
      navigate("/study");
    } catch (error: any) {
      setDeck(null);
      window.alert(error.response);
      console.log(error.response);
    }
  }

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, []);

  useEffect(() => {
    setDisplayDecks(decks?.slice(0, 5) || []);
  }, [decks]);

  useEffect(() => {
    setDisplayDecks(decks?.slice(pageIndex * 5, pageIndex * 5 + 5) || []);
  }, [pageIndex]);

  return (
    <div className={`max-w-3xl m-auto px-5 py-8`}>
      <div className="flex items-center gap-5 select-none">
        {loading ? (
          <svg
            fill="hsl(228, 97%, 42%)"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 fill-blue"
          >
            <path
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.75s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        ) : (
          <p className="relative border-3 rounded-full min-h-14 min-w-14 text-2xl font-display font-bold bg-red flex justify-center items-center ">
            {user?.username.slice(0, 1)}
          </p>
        )}

        <div className="flex justify-between items-center w-full">
          <div>
            <p className="font-bold font-display text-4xl max-md:text-2xl">
              {loading ? "Loading..." : user?.username}
            </p>
            <p className="text-brown text-[0.9rem]">
              Member since{" "}
              {loading
                ? "..."
                : user?.createdAt
                  ? new Date(user?.createdAt).toString().slice(4, 15)
                  : ""}
            </p>
          </div>

          {!loading && (
            <button
              className="border border-dark  rounded-full md:py-2 md:px-4 max-md:p-2 text-[0.9rem] hover:bg-dark hover:text-white transition hover:cursor-pointer"
              onClick={() => navigate("/create")}
            >
              <p className="max-md:hidden">+ New Card / Deck</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
                className="hidden max-md:block"
              >
                <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="py-7">
        <div className="flex justify-between items-center select-none">
          <h3 className="font-display font-bold text-[1.4rem] mb-1">
            My decks
          </h3>
          <p className="text-[0.9rem] text-brown">{decks?.length} Decks</p>
        </div>
        {decks?.length !== 0 && (
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Looking for a deck?"
              className="border-border border w-full bg-white py-2 pl-5 pr-10 text-dark rounded-sm placeholder:text-border text-[0.9rem] focus:border-blue focus:outline-0 transition"
              onChange={(e) => {
                setPageIndex(0);
                setDisplayDecks(
                  e.target.value
                    ? (decks || []).filter((deck) =>
                        deck.deckName.includes(e.target.value),
                      )
                    : decks?.slice(0, 5) || [],
                );
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
              className="absolute top-1/2 right-0 -translate-1/2 w-5"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </div>
        )}

        {decks?.length === 0 ? (
          <div className="flex justify-center items-center flex-col py-10 select-none">
            <img src="ico.png" alt="cards" className="w-20 pb-5" />
            <p className="max-w-60 text-center text-brown pb-5">
              Ready to learn something new? Create your first deck.
            </p>
            <button
              className="border border-dark  rounded-full py-2 px-4 text-[0.9rem] hover:bg-dark hover:text-white transition hover:cursor-pointer"
              onClick={() => navigate("/create")}
            >
              + New Deck
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 *:select-none">
            {loading ? (
              <div className="flex flex-col gap-2 *:border *:border-border *:bg-white *:rounded-2xl">
                <button className="h-20 px-5 animate-pulse hover:border-border! hover:bg-white! hover:cursor-default!"></button>
                <button className="h-20 px-5 animate-pulse hover:border-border! hover:bg-white! hover:cursor-default!"></button>
                <button className="h-20 px-5 animate-pulse hover:border-border! hover:bg-white! hover:cursor-default!"></button>
              </div>
            ) : (
              displayDecks?.map((deck, index) => (
                <div
                  className="flex items-center gap-5 py-4 px-5 border border-border bg-white rounded-2xl transition"
                  key={index}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                    className="max-sm:hidden"
                  >
                    <path d="M130-189 81-546q-5-32 15.5-58t52.5-31l61 435 283-40h267q-8 21-24.5 35.5T695-187l-477 66q-33 5-58-15t-30-53Zm190-127q-33 0-56.5-23.5T240-396v-364q0-33 23.5-56.5T320-840h480q33 0 56.5 23.5T880-760v364q0 33-23.5 56.5T800-316H320Zm0-80h480v-364H320v364Zm0 0v-364 364ZM210-200Zm190-400h320v-80H400v80Zm0 120h200v-80H400v80Z" />
                  </svg>
                  <div className="flex items-center justify-between grow max-sm:flex-col max-sm:items-start">
                    <div>
                      <p className="font-semibold">
                        {deck.deckName.length > 30
                          ? deck.deckName.slice(0, 30).concat("...")
                          : deck.deckName}
                      </p>
                      <p className="text-[0.8rem] text-brown">
                        Created at{" "}
                        {new Date(deck.createdAt).toString().slice(4, 15)}
                        {"  -  "}
                        {deck.cardCount} cards
                      </p>
                    </div>
                    <div className={`flex gap-2  max-sm:self-end max-sm:mt-2`}>
                      <button
                        className="border border-border bg-cream p-1 rounded-lg hover:cursor-pointer hover:opacity-70 transition"
                        onClick={() => {
                          navigate(`/deck-settings/${deck._id}`);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000000"
                        >
                          <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                        </svg>
                      </button>
                      <button
                        className={`border border-border bg-cream p-1 rounded-lg hover:cursor-pointer hover:opacity-70 transition ${deck.cardCount === 0 && "*:opacity-30 *:hover:cursor-default! *:hover:opacity-30"}`}
                        onClick={() => {
                          if (deck.cardCount === 0) return;
                          getDeck(deck._id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000000"
                          className="ml-auto"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {decks && decks?.length > 5 && (
          <div className="flex justify-end items-center gap-1 mt-5 select-none">
            <p className="text-brown mr-3 text-[0.9rem]">
              Page {pageIndex + 1} | {Math.round(decks?.length / 5)}
            </p>
            <button
              className={`border border-border bg-white p-2 rounded-lg transition hover:opacity-60 hover:cursor-pointer ${pageIndex === 0 && "opacity-40! hover:cursor-default!"}`}
              onClick={() =>
                setPageIndex((prev) => (prev === 0 ? prev : prev - 1))
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
                className="scale-90"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
            </button>
            <button
              className={`border border-border bg-white p-2 rounded-lg transition hover:opacity-60 hover:cursor-pointer ${pageIndex === Math.round(decks?.length / 5) - 1 && "opacity-40! hover:cursor-default!"}`}
              onClick={() =>
                setPageIndex((prev) =>
                  prev === Math.round(decks?.length / 5) - 1 ? prev : prev + 1,
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
                className="scale-90"
              >
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
