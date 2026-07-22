import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cardsAnswerIndex, setCardsAnswerIndex] = useState([
    false,
    false,
    false,
  ]);
  const cardsContent = [
    { q: "What's the powerhouse of the cell?", a: "Mitochondria" },
    { q: "When did WWII end?", a: "1945" },
    { q: "How many bones are there in the human body?", a: "206" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full max-w-6xl m-auto px-10">
        {/* home hero */}
        <div className="flex flex-col justify-center items-center pt-15 pb-5 select-none">
          <h2 className="entry-animation1 font-display font-bold text-6xl max-md:text-6xl max-sm:text-5xl pb-4 max-w-150 text-center">
            Learn faster with <span className="text-pink">smart</span>{" "}
            flashcards
          </h2>
          <p className="entry-animation2 text-brown text-[1.2rem] max-sm:text-[1rem] max-w-150 text-center">
            Create, study, and master any topic. Choose how you want to be
            tested. Reveal, type or pick the answer.
          </p>

          <div className="entry-animation1 my-10 flex max-sm:flex-col max-sm:w-full gap-3">
            <button
              className="border border-dark bg-dark text-cream rounded-full px-8 py-3 transition hover:cursor-pointer hover:-translate-1 hover:shadow-[3px_4px_0_black]"
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  navigate("/profile");
                }
              }}
            >
              Get started free
            </button>

            <button
              className="border border-dark bg-cream text-dark rounded-full px-8 py-3 transition hover:cursor-pointer hover:-translate-1 hover:shadow-[3px_4px_0_black]"
              onClick={() => navigate("/demo")}
            >
              Try a demo deck
            </button>
          </div>
        </div>

        {/* home display cards */}
        <div className="relative flex justify-center items-center gap-7 mb-20 select-none max-w-3xl m-auto *:min-w-60 *:hover:cursor-pointer *:transition">
          <div
            className="entry-animation1 card-1 absolute left-0 max-w-60 min-h-40 border-2 border-dark text-dark bg-teal active:scale-105 shadow-[3px_3px_0px_black] rounded-3xl px-4 py-6 flex flex-col justify-center items-center max-[820px]:-rotate-5 z-5"
            onClick={() => {
              setCardsAnswerIndex((prev) => {
                let i = [...prev];
                i[0] = !i[0];
                return i;
              });
            }}
          >
            <p className="absolute top-0 left-0 p-2 text-2xl opacity-80">✦</p>
            <p className="absolute bottom-0 right-0 p-3 text-1xl opacity-80">
              ✦
            </p>
            <div className="absolute top-3 border-2 border-white/60 bg-white/30 rounded-full px-3 py-0.5 text-[0.8rem] font-body font-bold">
              Biology
            </div>

            <p className="font-display font-bold mt-3 text-center">
              {!cardsAnswerIndex[0] ? cardsContent[0].q : cardsContent[0].a}
            </p>
          </div>

          <div
            className="entry-animation2 relative card-2 max-w-60 min-h-40 border-2 border-dark text-dark bg-pink active:scale-105 shadow-[3px_3px_0px_black] rounded-3xl px-4 py-6 flex flex-col justify-center items-center z-6"
            onClick={() => {
              setCardsAnswerIndex((prev) => {
                let i = [...prev];
                i[1] = !i[1];
                return i;
              });
            }}
          >
            <p className="absolute top-0 left-0 p-2 text-2xl opacity-80">✦</p>
            <p className="absolute bottom-0 right-0 p-3 text-1xl opacity-80">
              ✦
            </p>
            <div className="absolute top-3 border-2 border-white/60 bg-white/30 rounded-full px-3 py-0.5 text-[0.8rem] font-body font-bold">
              History
            </div>

            <p className="font-display font-bold mt-3 text-center">
              {!cardsAnswerIndex[1] ? cardsContent[1].q : cardsContent[1].a}
            </p>
          </div>

          <div
            className="entry-animation3 card-3 absolute right-0 max-w-60 min-h-40 border-2 border-dark text-dark bg-blue active:scale-105 shadow-[3px_3px_0px_black] rounded-3xl px-4 py-6 flex flex-col justify-center items-center max-[820px]:rotate-5 z-7"
            onClick={() => {
              setCardsAnswerIndex((prev) => {
                let i = [...prev];
                i[2] = !i[2];
                return i;
              });
            }}
          >
            <p className="absolute top-0 left-0 p-2 text-2xl opacity-80">✦</p>
            <p className="absolute bottom-0 right-0 p-3 text-1xl opacity-80">
              ✦
            </p>
            <div className="absolute top-3 border-2 border-white/60 bg-white/30 rounded-full px-3 py-0.5 text-[0.8rem] font-body font-bold">
              Anatomy
            </div>

            <p className="font-display font-bold mt-3 text-center">
              {!cardsAnswerIndex[2] ? cardsContent[2].q : cardsContent[2].a}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
