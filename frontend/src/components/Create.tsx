import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewDeck from "./NewDeck";
import LoadingCreate from "./LoadingCreate";

export default function Create() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  const [loadingCreate, setLoadinCreate] = useState(false);
  const [apiRes, setApiRes] = useState<{
    msg: string;
    code: null | number;
  }>({
    msg: "",
    code: null,
  });
  const [question, setQuestion] = useState("");
  const [deck, setDeck] = useState("");
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
  const [valid, setValid] = useState(false);
  const [newDeckTab, setNewDeckTab] = useState(false);

  async function postCard(action: string) {
    setValid(false);
    setLoadinCreate(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/card`,
        {
          deckId: deck,
          question: question,
          answer: answer,
          options: [options.opt1, options.opt2, options.opt3, options.opt4],
          difficulty: difficulty,
        },
        {
          withCredentials: true,
        },
      );

      setApiRes({
        msg: response.data.message,
        code: response.status,
      });

      setTimeout(() => {
        setApiRes({
          msg: "",
          code: null,
        });
        setLoadinCreate(false);

        if (action === "redirect") {
          window.location.href = "/profile";
        } else {
          location.reload();
        }
      }, 2000);

      setAnswer("");
      setQuestion("");
      setDifficulty("");
      setOptions({
        opt1: "",
        opt2: "",
        opt3: "",
        opt4: "",
      });
    } catch (error: any) {
      setApiRes({
        msg: "Internal server error",
        code: 500,
      });
      setTimeout(() => {
        setApiRes({
          msg: "",
          code: null,
        });
        setLoadinCreate(false);
        location.reload();
      }, 2000);
      console.log(error.response);
    }
  }

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, []);

  useEffect(() => {
    if (
      question &&
      deck &&
      difficulty &&
      answer &&
      options.opt1 !== "" &&
      options.opt2 !== "" &&
      options.opt3 !== "" &&
      options.opt4 !== ""
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [question, deck, difficulty, answer, options]);

  return (
    <div className="max-w-3xl m-auto p-5 max-md:bg-white">
      {newDeckTab && <NewDeck setNewDeckTab={setNewDeckTab} />}
      {loadingCreate && <LoadingCreate apiRes={apiRes} />}
      <div className="flex justify-between items-center mb-5 select-none">
        <div className="flex items-center gap-4">
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
          <p className="font-bold font-display text-2xl max-sm:text-[1rem]">
            New Flashcard
          </p>
        </div>

        <button
          className="border border-border text-[0.9rem] bg-white min-w-10 min-h-10 rounded-full transition hover:border-dark hover:bg-cream hover:cursor-pointer px-5"
          onClick={() => setNewDeckTab(true)}
        >
          + Create Deck
        </button>
      </div>

      <div
        className={`border border-border max-md:border-0 transition bg-white rounded-2xl p-6 max-md:p-0 ${loadingCreate && "opacity-40"}`}
      >
        <div>
          <div className="flex flex-col">
            <label
              htmlFor="question"
              className="font-semibold text-[0.9rem] mb-1 text-dark"
            >
              Question
            </label>
            <textarea
              onChange={(e) => setQuestion(e.target.value.slice(0, 255))}
              value={question}
              name="question"
              id="question"
              placeholder="What do you want to be asked?"
              className="border-border border bg-cream rounded-[10px] resize-none min-h-25 p-3 text-[0.9rem] focus:outline-3 focus:outline-yellow"
            ></textarea>
            <p
              className={`text-brown transition ${question.length >= 100 && "text-yellow-600"} ${question.length >= 255 && "text-red!"} text-[0.8rem] ml-auto py-2`}
            >
              {question.length} | 255
            </p>
          </div>

          <div className="flex gap-3 mb-4 max-md:flex-col">
            <div className="w-1/2 flex flex-col max-md:w-full">
              <label
                htmlFor="deck"
                className="font-semibold text-[0.9rem] mb-1 text-dark"
              >
                Deck
              </label>
              {user?.decks.length !== 0 ? (
                <div className="relative">
                  <select
                    onChange={(e) => setDeck(e.target.value)}
                    name="deck"
                    id="deck"
                    className="border border-border bg-cream rounded-[10px] p-2 text-[0.9rem] focus:outline-3 focus:outline-yellow appearance-none w-full"
                  >
                    <option value="">Select one of your decks</option>
                    {user?.decks.map((deck, index) => (
                      <option key={index} value={deck._id}>
                        {deck.deckName}
                      </option>
                    ))}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <path d="M480-360 280-560h400L480-360Z" />
                  </svg>
                </div>
              ) : (
                <button
                  className="relative overflow-hidden border border-dark rounded-full md:py-2 md:px-4 max-md:p-2 text-[0.9rem] hover:bg-dark hover:text-white transition hover:cursor-pointer before:content-[] before:absolute before:w-2 before:h-2 before:bg-teal before:top-1/2 before:-translate-1/2 before:left-5 before:rounded-full before:animate-ping"
                  onClick={() => setNewDeckTab(true)}
                >
                  + Create your first Deck
                </button>
              )}
            </div>
            <div className="w-1/2 flex flex-col max-md:w-full">
              <label
                htmlFor="difficulty"
                className="font-semibold text-[0.9rem] mb-1 text-dark"
              >
                Difficulty
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setDifficulty(e.target.value)}
                  name="difficulty"
                  id="difficulty"
                  className="border border-border bg-cream rounded-[10px] p-2 text-[0.9rem] focus:outline-3 focus:outline-yellow appearance-none w-full"
                >
                  <option value="">How hard is it?</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <path d="M480-360 280-560h400L480-360Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="answer"
              className="font-semibold text-[0.9rem] mb-1 text-dark"
            >
              Answer
            </label>
            <textarea
              onChange={(e) => {
                setAnswer(e.target.value.slice(0, 255));
                setOptions((prev) => ({ ...prev, opt4: e.target.value }));
              }}
              value={answer}
              name="answer"
              id="answer"
              placeholder="The correct answer goes here..."
              className="border-border border bg-cream rounded-[10px] resize-none min-h-25 p-3 text-[0.9rem] focus:outline-3 focus:outline-yellow"
            ></textarea>
            <p
              className={`text-brown transition ${answer.length >= 100 && "text-yellow-600"} ${answer.length >= 255 && "text-red!"} text-[0.8rem] ml-auto py-2`}
            >
              {answer.length} | 255
            </p>
          </div>

          <div className="border border-border bg-cream p-3 rounded-[10px] flex flex-col">
            <label className="text-brown text-[0.8rem] font-semibold mb-3">
              Wrong options (distractors)
            </label>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <label
                  htmlFor="opt-1"
                  className="border border-border bg-white min-h-8 min-w-8 rounded-full flex justify-center items-center text-[0.9rem] hover:cursor-pointer"
                >
                  1
                </label>
                <input
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, opt1: e.target.value }))
                  }
                  value={options.opt1}
                  required={true}
                  maxLength={100}
                  id="opt-1"
                  type="text"
                  placeholder="Wrong option 1"
                  className="border border-border bg-white w-full rounded-md px-3 py-1 text-[0.8rem] focus:outline-3 focus:outline-yellow"
                />
              </div>
              <div className="flex gap-2">
                <label
                  htmlFor="opt-2"
                  className="border border-border bg-white min-h-8 min-w-8 rounded-full flex justify-center items-center text-[0.9rem] hover:cursor-pointer"
                >
                  2
                </label>
                <input
                  value={options.opt2}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, opt2: e.target.value }))
                  }
                  required={true}
                  maxLength={100}
                  id="opt-2"
                  type="text"
                  placeholder="Wrong option 1"
                  className="border border-border bg-white w-full rounded-md px-3 py-1 text-[0.8rem] focus:outline-3 focus:outline-yellow"
                />
              </div>
              <div className="flex gap-2">
                <label
                  htmlFor="opt-3"
                  className="border border-border bg-white min-h-8 min-w-8 rounded-full flex justify-center items-center text-[0.9rem] hover:cursor-pointer"
                >
                  3
                </label>
                <input
                  value={options.opt3}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, opt3: e.target.value }))
                  }
                  required={true}
                  maxLength={100}
                  id="opt-3"
                  type="text"
                  placeholder="Wrong option 1"
                  className="border border-border bg-white w-full rounded-md px-3 py-1 text-[0.8rem] focus:outline-3 focus:outline-yellow"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5 max-md:flex-col select-none">
            <button
              onClick={() => {
                if (!valid) return;
                postCard("");
              }}
              disabled={!valid}
              className={`border-2 border-dark bg-yellow font-semibold py-3 px-6 rounded-full text-[0.9rem] shadow-[3px_4px_0px_black] transition hover:translate-1 hover:shadow-none w-1/2 hover:cursor-pointer ${!valid && "shadow-none translate-1 hover:cursor-default! opacity-50"} max-md:w-full`}
            >
              Save & Add Another
            </button>

            <button
              onClick={() => {
                if (!valid) return;
                postCard("redirect");
              }}
              disabled={!valid}
              className={`border-2 border-dark bg-dark text-white font-semibold py-3 px-6 rounded-full text-[0.9rem] shadow-[3px_4px_0px_black] transition hover:translate-1 hover:shadow-none w-1/2 hover:cursor-pointer ${!valid && "shadow-none translate-1 hover:cursor-default! opacity-50"} max-md:w-full`}
            >
              Save & Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
