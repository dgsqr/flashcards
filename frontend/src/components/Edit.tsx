import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useEffect, useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import LoadingCreate from "./LoadingCreate";

export default function Edit({
  question,
  cardId,
  answer,
  difficulty,
  options,
  setEditCard,
}: {
  question: string;
  cardId: string;
  answer: string;
  difficulty: string;
  options: {
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
  };
  setEditCard: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  const [newQuestion, setNewQuestion] = useState(question || "");
  const [newDifficulty, setNewDifficulty] = useState(difficulty || "");
  const [newAnswer, setNewAnswer] = useState(answer || "");
  const [newOptions, setNewOptions] = useState<{
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
  }>({
    opt1: options.opt1 || "",
    opt2: options.opt2 || "",
    opt3: options.opt3 || "",
    opt4: options.opt4 || "",
  });

  const [loadingCreate, setLoadinCreate] = useState(false);
  const [apiRes, setApiRes] = useState<{
    msg: string;
    code: null | number;
  }>({
    msg: "",
    code: null,
  });
  const [valid, setValid] = useState(false);

  async function updateCard() {
    setValid(false);
    setLoadinCreate(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/card/${cardId}`,
        {
          question: newQuestion,
          answer: newAnswer,
          options: [
            newOptions.opt1,
            newOptions.opt2,
            newOptions.opt3,
            newOptions.opt4,
          ],
          difficulty: newDifficulty,
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
        setEditCard(false);

        location.reload();
      }, 1000);

      setNewAnswer("");
      setNewQuestion("");
      setNewDifficulty("");
      setNewOptions({
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
      newQuestion &&
      newDifficulty &&
      newAnswer &&
      newOptions.opt1 !== "" &&
      newOptions.opt2 !== "" &&
      newOptions.opt3 !== "" &&
      newOptions.opt4 !== ""
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [newQuestion, newDifficulty, newAnswer, newOptions]);

  return (
    <div className="p-5 bg-black/30 max-sm:bg-white absolute top-0 left-0 w-full">
      <div className="max-w-2xl m-auto">
        {loadingCreate && <LoadingCreate apiRes={apiRes} />}
        <div className="flex justify-between items-center mb-5 select-none">
          <div className="flex items-center gap-4">
            {/* close edit window */}
            <button
              className="border-2 border-border bg-white min-w-10 min-h-10 rounded-full flex justify-center items-center transition hover:border-dark hover:bg-cream hover:cursor-pointer"
              onClick={() => setEditCard(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
            <p className="font-bold font-display text-2xl text-white max-sm:text-black">
              Edit Card
            </p>
          </div>
        </div>

        <div
          className={`border border-border max-sm:border-0 transition bg-white rounded-2xl p-6 max-sm:p-0 ${loadingCreate && "opacity-40"}`}
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
                onChange={(e) => setNewQuestion(e.target.value.slice(0, 255))}
                value={newQuestion}
                name="question"
                id="question"
                placeholder="What do you want to be asked?"
                className="border-border border bg-cream rounded-[10px] resize-none min-h-25 p-3 text-[0.9rem] focus:outline-3 focus:outline-yellow"
              ></textarea>
              <p
                className={`text-brown transition ${newQuestion.length >= 100 && "text-yellow-600"} ${newQuestion.length >= 255 && "text-red!"} text-[0.8rem] ml-auto py-2`}
              >
                {newQuestion.length} | 255
              </p>
            </div>

            <div className="flex gap-3 mb-4 max-md:flex-col">
              <div className="w-full flex flex-col max-md:w-full">
                <label
                  htmlFor="difficulty"
                  className="font-semibold text-[0.9rem] mb-1 text-dark"
                >
                  Difficulty
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    value={newDifficulty}
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
                  setNewAnswer(e.target.value.slice(0, 255));
                  setNewOptions((prev) => ({ ...prev, opt4: e.target.value }));
                }}
                value={newAnswer}
                name="answer"
                id="answer"
                placeholder="The correct answer goes here..."
                className="border-border border bg-cream rounded-[10px] resize-none min-h-25 p-3 text-[0.9rem] focus:outline-3 focus:outline-yellow"
              ></textarea>
              <p
                className={`text-brown transition ${newAnswer.length >= 100 && "text-yellow-600"} ${newAnswer.length >= 255 && "text-red!"} text-[0.8rem] ml-auto py-2`}
              >
                {newAnswer.length} | 255
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
                      setNewOptions((prev) => ({
                        ...prev,
                        opt1: e.target.value,
                      }))
                    }
                    value={newOptions.opt1}
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
                    value={newOptions.opt2}
                    onChange={(e) =>
                      setNewOptions((prev) => ({
                        ...prev,
                        opt2: e.target.value,
                      }))
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
                    value={newOptions.opt3}
                    onChange={(e) =>
                      setNewOptions((prev) => ({
                        ...prev,
                        opt3: e.target.value,
                      }))
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
              {/* save edits */}
              <button
                onClick={() => {
                  if (!valid) return;
                  updateCard();
                }}
                disabled={!valid}
                className={`border-2 border-dark bg-yellow font-semibold py-3 px-6 rounded-full text-[0.9rem] shadow-[3px_4px_0px_black] transition hover:translate-1 hover:shadow-none w-1/2 hover:cursor-pointer ${!valid && "shadow-none translate-1 hover:cursor-default! opacity-50"} max-md:w-full`}
              >
                Save
              </button>

              {/* close edit window */}
              <button
                onClick={() => {
                  setEditCard(false);
                }}
                className={`border-2 border-dark bg-dark text-white font-semibold py-3 px-6 rounded-full text-[0.9rem] shadow-[3px_4px_0px_black] transition hover:translate-1 hover:shadow-none w-1/2 hover:cursor-pointer max-md:w-full`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
