import { useLayoutEffect, useRef, useState } from "react";
import { useDeck } from "../contexts/DeckContext";
import SelectDeck from "./SelectDeck";

export default function Study() {
  const { deck } = useDeck();
  const [mode, setMode] = useState("reveal");
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  const [cardColorIndex, setCardColorIndex] = useState(0);
  const [deckFinished, setDeckFinished] = useState(false);
  const [cards, setCards] = useState(deck?.cards);

  const card = useRef<HTMLDivElement>(null);
  const choiceContainer = useRef<HTMLDivElement>(null);
  const choiceBlocker = useRef<HTMLDivElement>(null);

  const cardColor = ["bg-teal", "bg-pink", "bg-blue", "bg-yellow"];

  useLayoutEffect(() => {
    setCardColorIndex((prev) => {
      if (prev === 0) return 1;
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      if (prev === 3) return 0;
      return prev;
    });
  }, [cardIndex]);

  function isAnswerCorrect(answer: boolean) {
    if (answer) {
      card.current?.classList.add("bg-green-500!");
      setTimeout(() => {
        card.current?.classList.remove("bg-green-500!");
        setCardIndex((prev) => (prev === cards!.length - 1 ? prev : prev + 1));

        if (cardIndex === cards!.length - 1) {
          setDeckFinished(true);
        }
      }, 1000);
    }

    if (!answer) {
      if (mode === "choice") {
        choiceBlocker.current!.classList.remove("hidden");
        setTimeout(() => {
          choiceBlocker.current!.classList.add("hidden");
        }, 1000);

        Array.from(choiceContainer.current!.children).forEach((btn) => {
          if (btn.textContent === cards![cardIndex].answer) {
            btn.classList.add("border-green-500!");
            btn.classList.add("bg-green-500!");
            setTimeout(() => {
              btn.classList.remove("border-green-500!");
              btn.classList.remove("bg-green-500!");
            }, 1000);
          } else {
            return;
          }
        });
      }

      card.current?.classList.add("bg-red!");
      setTimeout(() => {
        card.current?.classList.remove("bg-red!");
        setCardIndex((prev) => (prev === cards!.length - 1 ? prev : prev + 1));

        if (cardIndex === cards!.length - 1) {
          setDeckFinished(true);
        }
      }, 1000);
    }
  }

  function checkAnswer(answer: string) {
    if (answer == cards![cardIndex].answer) {
      if (mode === "choice" || mode === "type") {
        isAnswerCorrect(true);
      }
    } else {
      isAnswerCorrect(false);
    }
  }

  return (
    <div className="p-5 max-sm:p-0 h-full">
      {deck ? (
        <div className="border border-border rounded-2xl bg-white max-sm:bg-transparent max-w-3xl m-auto max-sm:rounded-none max-sm:border-0 max-sm:flex max-sm:flex-col max-sm:justify-between">
          <div className="max-sm:bg-white">
            <div className="flex justify-center items-center py-3 px-5 select-none border-b border-border wrap-break-word">
              {/* deck title */}
              <p
                className="font-display font-bold text-2xl max-w-150 text-center break-all"
                title={deck?.deck}
              >
                {deck?.deck}
              </p>
            </div>
            <div className="flex justify-center items-center gap-2 p-2 select-none border-b border-border *:border *:border-border *:rounded-full *:text-[0.9rem] *:py-2 *:px-4 *:hover:border-dark *:hover:cursor-pointer *:hover:bg-cream *:transition *:flex *:items-center *:gap-1 *:*:h-5">
              <button
                onClick={() => setMode("reveal")}
                className={`${mode === "reveal" && "border-dark! bg-dark! text-white! *:fill-white"} max-md:grow max-md:flex max-md:justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z" />
                </svg>
                <p className="max-sm:hidden">Reveal</p>
              </button>
              <button
                onClick={() => setMode("type")}
                className={`${mode === "type" && "border-dark! bg-dark! text-white! *:fill-white"}  max-md:grow max-md:flex max-md:justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm160-40h320v-80H320v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM160-280v-400 400Z" />
                </svg>
                <p className="max-sm:hidden">Type Answer</p>
              </button>
              <button
                onClick={() => setMode("choice")}
                className={`${mode === "choice" && "border-dark! bg-dark! text-white! *:fill-white"}  max-md:grow max-md:flex max-md:justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                </svg>
                <p className="max-sm:hidden">Multiple Choice</p>
              </button>
            </div>
          </div>

          <div className="p-5 max-sm:mb-1 max-sm:flex max-sm:flex-col">
            {!deckFinished ? (
              <>
                <div
                  ref={card}
                  className={`relative max-w-full min-h-60 border-2 border-dark text-dark ${cardColor[cardColorIndex]} rounded-3xl px-4 py-6 flex flex-col justify-center items-center mb-5 select-none transition  ${mode === "reveal" && "hover:cursor-pointer hover:opacity-90"} max-sm:grow`}
                  onClick={() => {
                    if (mode === "reveal") {
                      setRevealAnswer(!revealAnswer);
                    }
                  }}
                >
                  <p className="absolute top-0 left-0 p-3 text-2xl opacity-80">
                    ✦
                  </p>
                  <p className="absolute bottom-0 right-0 p-3 text-1xl opacity-80">
                    ✦
                  </p>
                  <div
                    className="absolute top-3 border-2 border-white/60 bg-white/30 rounded-full px-3 py-0.5 text-[0.8rem] font-body font-bold"
                    title={deck?.deck}
                  >
                    {deck?.deck.length > 20
                      ? deck?.deck.slice(0, 20).concat("...")
                      : deck?.deck}
                  </div>

                  <p className="font-display font-bold mt-3 text-center max-w-120 wrap-break-word py-5 break-all">
                    {!revealAnswer
                      ? cards![cardIndex].question
                      : cards![cardIndex].answer}
                  </p>

                  {mode === "reveal" && (
                    <p className="mt-3 text-[0.9rem] opacity-80">
                      Click to reveal the answer...
                    </p>
                  )}

                  {mode === "type" && (
                    <input
                      placeholder="Type your answer here..."
                      type="text"
                      onChange={(e) => setUserAnswer(e.target.value.trim())}
                      value={userAnswer}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setUserAnswer("");
                          checkAnswer(userAnswer);
                        }
                      }}
                      className="border-2 border-white/50 bg-white/50 rounded-lg w-[80%] my-4 text-center py-2 focus:outline-0 focus:border-white transition text-[0.9rem]"
                    />
                  )}

                  {mode === "choice" && (
                    <div
                      ref={choiceContainer}
                      className="grid grid-cols-2 items-start gap-2 my-4 w-[80%] *:border-2 *:border-white/50 *:bg-white/50 *:rounded-lg *:py-1 *:px-4 *:hover:border-white *:hover:bg-white/70 *:hover:cursor-pointer *:transition *:text-[0.9rem] wrap-break-word"
                    >
                      <div
                        className="absolute opacity-0 hidden top-0 left-0 w-full h-full"
                        ref={choiceBlocker}
                      ></div>
                      {cards![cardIndex].options.map((opt, index) => (
                        <button key={index} onClick={() => checkAnswer(opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 select-none max-sm:flex-col max-sm:*:w-full max-sm:*:justify-center">
                  <button
                    className="border-2 border-dark bg-yellow rounded-full py-3 px-6 text-[0.9rem] -translate-1 shadow-[2px_3px_0px_black] hover:cursor-pointer hover:translate-0 hover:shadow-none transition flex items-center gap-1 *:h-5"
                    onClick={() => {
                      setCardIndex((prev) =>
                        prev === cards!.length - 1 ? prev : prev + 1,
                      );
                      if (cardIndex === cards!.length - 1) {
                        setDeckFinished(true);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                    I Know This
                  </button>
                  <button
                    className="border border-border rounded-full text-[0.9rem] py-3 px-6 hover:border-dark hover:cursor-pointer hover:bg-border transition bg-white flex items-center gap-1 *:h-5"
                    onClick={() => setCardIndex(0)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                    </svg>
                    Reset Progress
                  </button>
                  <button
                    className="border border-border rounded-full text-[0.9rem] py-3 px-6 hover:border-dark hover:cursor-pointer hover:bg-border transition bg-white flex items-center gap-1 *:h-5"
                    onClick={() => {
                      if (deckFinished) return;
                      setCardIndex(0);
                      setCards((prev) => {
                        let shuffled = [...prev!].sort(
                          () => Math.random() - 0.5,
                        );
                        return shuffled;
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
                      <path d="M560-160v-80h104L537-367l57-57 126 126v-102h80v240H560Zm-344 0-56-56 504-504H560v-80h240v240h-80v-104L216-160Zm151-377L160-744l56-56 207 207-56 56Z" />
                    </svg>
                    Shuffle
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center py-15">
                <p className="font-display font-bold text-2xl pb-8">
                  Deck finished!
                </p>

                <div className="flex items-center justify-center gap-2 select-none">
                  <button
                    className="border-2 border-dark bg-yellow rounded-full py-3 px-6 text-[0.9rem] -translate-1 shadow-[2px_3px_0px_black] hover:cursor-pointer hover:translate-0 hover:shadow-none transition flex items-center gap-1 *:h-5"
                    onClick={() => {
                      history.back();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                    </svg>
                    Return
                  </button>
                  <button
                    className="border border-border rounded-full text-[0.9rem] py-3 px-6 hover:border-dark hover:cursor-pointer hover:bg-border transition bg-white flex items-center gap-1 *:h-5"
                    onClick={() => {
                      setCardIndex(0);
                      setDeckFinished(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                    </svg>
                    Go Again
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-border px-5 py-3 max-sm:bg-transparent max-sm:border-none select-none">
            <button
              disabled={deckFinished}
              className={`border border-border max-sm:bg-white rounded-full text-[0.9rem] py-2 px-6 hover:border-dark hover:cursor-pointer hover:bg-cream transition flex items-center gap-1 *:h-5 ${deckFinished && "opacity-40 hover:border-border! hover:bg-transparent! hover:cursor-default!"}`}
              onClick={() => {
                setRevealAnswer(false);
                setCardIndex((prev) => (prev === 0 ? prev : prev - 1));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
              Prev
            </button>
            <p className="text-brown text-[0.8rem]">
              Card {cardIndex + 1} of {cards!.length}
            </p>
            <button
              disabled={deckFinished}
              className={`border border-border max-sm:bg-white rounded-full text-[0.9rem] py-2 px-6 hover:border-dark hover:cursor-pointer hover:bg-cream transition flex items-center gap-1 *:h-5 ${deckFinished && "opacity-40 hover:border-border! hover:bg-transparent! hover:cursor-default!"}`}
              onClick={() => {
                setRevealAnswer(false);
                setCardIndex((prev) =>
                  prev === cards!.length - 1 ? prev : prev + 1,
                );
              }}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <SelectDeck />
      )}
    </div>
  );
}
