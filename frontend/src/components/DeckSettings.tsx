import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { Deck } from "../contexts/DeckContext";
import { useNavigate } from "react-router-dom";
import Edit from "./Edit";
import DeleteDeck from "./DeleteDeck";

export default function DeckSettings() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [deckData, setDeckData] = useState<Deck | null>(null);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [editCard, setEditCard] = useState(false);
  const [deleteDeckTab, setDeleteDeckTab] = useState(false);

  const [moreDropdown, setMoreDropdown] = useState(false);
  const dropdown = useRef<HTMLDivElement | null>(null);

  const [pageIndex, setPageIndex] = useState(0);

  const [deleteAction, setDeleteAction] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState<{
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
  }>({
    opt1: "",
    opt2: "",
    opt3: "",
    opt4: "",
  });
  const [cardId, setCardId] = useState<any>("");

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editTitle) titleInput.current?.focus();
  }, [editTitle]);

  useEffect(() => {
    async function getDeck(deckId: String | string) {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/deck/${deckId}`,
          {
            withCredentials: true,
          },
        );
        setDeckData(data);
      } catch (error: any) {
        setDeckData(null);
        window.alert(error.response);
        console.log(error.response);
      }
    }

    if (id) {
      getDeck(id);
    } else {
      window.alert("Invalid ID.");
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdown.current && !dropdown.current.contains(e.target as Node)) {
        setMoreDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });

  async function updateTitle() {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/deck/${id}`,
        {
          deckName: newDeckName,
        },
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      setEditTitle(false);
      location.reload();
    } catch (error: any) {
      window.alert(error.response.data);
      console.log(error.response);
    }
  }

  return (
    <div className="max-w-3xl m-auto p-5">
      {deleteDeckTab && id && (
        <DeleteDeck
          setDeleteDeckTab={setDeleteDeckTab}
          deckId={id}
          cardId={cardId}
          deleteAction={deleteAction}
        />
      )}
      <div className="flex justify-between items-center mb-5 select-none max-sm:flex-col relative">
        {/* dropdown */}
        <div
          className={`absolute top-full right-0 flex flex-col w-40 gap-2 mt-2 ${!moreDropdown && "hidden"} focus:bg-red`}
          ref={dropdown}
        >
          <button
            className="border border-border text-[0.9rem] bg-white min-w-10 min-h-10 rounded-full transition hover:border-dark hover:bg-cream hover:cursor-pointer px-5"
            onClick={() => navigate("/create")}
          >
            + Add Card
          </button>
          <button
            className="border border-red-800 text-[0.9rem] bg-red min-w-10 min-h-10 rounded-full transition  hover:bg-red-300 hover:cursor-pointer px-5"
            onClick={() => {
              setDeleteDeckTab(true);
              setDeleteAction("deck");
            }}
          >
            Delete Deck
          </button>
        </div>
        <div className="flex items-center gap-4 max-sm:w-full max-sm:justify-between relative">
          <button
            className="border-2 border-border bg-white min-w-10 min-h-10 rounded-full flex justify-center items-center transition hover:border-dark hover:bg-cream hover:cursor-pointer"
            onClick={() => history.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
              className="fill-dark"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </button>
          {deckData ? (
            <>
              {editTitle ? (
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!newDeckName) {
                        setEditTitle(false);
                        return;
                      }
                      if (newDeckName === deckData.deck) {
                        setEditTitle(false);
                        return;
                      }
                      updateTitle();
                    }
                  }}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  ref={titleInput}
                  value={newDeckName || deckData?.deck}
                  className="block font-bold font-display text-2xl max-w-120 focus:outline-0"
                  type="text"
                />
              ) : (
                <p className="block font-bold font-display text-2xl max-w-120 overflow-hidden max-sm:text-[1rem]">
                  {deckData?.deck.length > 20
                    ? deckData?.deck.slice(0, 20).concat("...")
                    : deckData?.deck}
                </p>
              )}
              <button
                className={`hover:cursor-pointer ${editTitle && "hidden"}`}
                onClick={() => setEditTitle(!editTitle)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </button>
            </>
          ) : (
            <p className="block font-bold font-display text-2xl">Loading...</p>
          )}
        </div>

        <button
          className="border border-border text-[0.9rem] bg-white min-w-10 min-h-10 rounded-full transition hover:border-dark hover:bg-cream hover:cursor-pointer px-5 max-sm:w-full max-sm:mt-2 focus:outline-2 focus:outline-yellow"
          onClick={() => {
            setMoreDropdown(!moreDropdown);
          }}
        >
          More
        </button>
      </div>

      <div>
        {deckData ? (
          <div className="flex flex-col gap-2">
            {deckData.cards.length > 0 ? (
              deckData.cards
                .slice(pageIndex * 5, pageIndex * 5 + 5)
                .map((card, index) => (
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
                      <path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-560H160v560Zm80-80h480v-80H240v80Zm0-160h160v-240H240v240Zm240 0h240v-80H480v80Zm0-160h240v-80H480v80ZM160-200v-560 560Z" />
                    </svg>
                    <div className="flex items-center justify-between grow max-sm:flex-col max-sm:w-full max-sm:items-start">
                      <div>
                        <p className="font-semibold mb-2">
                          {card.question.length > 30
                            ? card.question.slice(0, 30).concat("...")
                            : card.question}
                        </p>
                        <p
                          className={`w-20 text-[0.8rem] px-2 border rounded-full text-center ${card.difficulty === "easy" && "border-green-400 bg-green-200"} ${card.difficulty === "hard" && "border-red-400 bg-red-200"} ${card.difficulty === "medium" && "border-yellow-400 bg-yellow-200"}`}
                        >
                          {card.difficulty}
                        </p>
                      </div>
                      <div
                        className={`flex gap-2 max-sm:w-full max-sm:justify-end max-sm:mt-2
                    `}
                      >
                        {/* edit card button */}
                        <button
                          className="border border-border bg-cream p-1 rounded-lg hover:cursor-pointer hover:opacity-70 transition"
                          onClick={() => {
                            setEditCard(!editCard);

                            setCardId(card._id);
                            setQuestion(card.question);
                            setDifficulty(card.difficulty);
                            setAnswer(card.answer);
                            setOptions({
                              opt1: card.options[0],
                              opt2: card.options[1],
                              opt3: card.options[2],
                              opt4: card.options[3],
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                          </svg>
                        </button>
                        {/* delete card button */}
                        <button
                          className="border border-border bg-cream p-1 rounded-lg hover:cursor-pointer hover:opacity-70 transition"
                          onClick={() => {
                            setCardId(card._id);
                            setDeleteDeckTab(true);
                            setDeleteAction("card");
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex justify-center items-center flex-col py-10 select-none">
                <img
                  src="../public/ico.png"
                  alt="cards"
                  className="w-20 pb-5"
                />
                <p className="max-w-60 text-center text-brown pb-5">
                  Ready to start your deck? Create your first card.
                </p>
                <button
                  className="border border-dark  rounded-full py-2 px-4 text-[0.9rem] hover:bg-dark hover:text-white transition hover:cursor-pointer"
                  onClick={() => navigate("/create")}
                >
                  + New Card
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 *:border *:border-border *:bg-white *:rounded-2xl">
            <button className="h-20 px-5 animate-pulse hover:border-border! hover:bg-white! hover:cursor-default!"></button>
            <button className="h-20 px-5 animate-pulse hover:border-border! hover:bg-white! hover:cursor-default!"></button>
            <button className="h-20 px-5 animate-pulse hover:border-border! hover:bg-white! hover:cursor-default!"></button>
          </div>
        )}
      </div>

      {deckData && deckData?.cards.length > 5 && (
        <div className="flex justify-end items-center gap-1 mt-5 select-none">
          <p className="text-brown mr-3 text-[0.9rem]">
            Page {pageIndex + 1} | {Math.round(deckData?.cards.length / 5)}
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
            className={`border border-border bg-white p-2 rounded-lg transition hover:opacity-60 hover:cursor-pointer ${pageIndex === Math.round(deckData?.cards.length / 5) - 1 && "opacity-40! hover:cursor-default!"}`}
            onClick={() =>
              setPageIndex((prev) =>
                prev === Math.round(deckData?.cards.length / 5) - 1
                  ? prev
                  : prev + 1,
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

      {editCard && (
        <Edit
          question={question}
          cardId={cardId || ""}
          difficulty={difficulty}
          answer={answer}
          options={options}
          setEditCard={setEditCard}
        />
      )}
    </div>
  );
}
