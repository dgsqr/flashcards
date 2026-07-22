import { useState, type SetStateAction } from "react";
import axios from "axios";

export default function DeleteDeck({
  setDeleteDeckTab,
  deckId,
  deleteAction,
  cardId,
}: {
  setDeleteDeckTab: React.Dispatch<SetStateAction<boolean>>;
  deckId: string | null;
  cardId: string | null;
  deleteAction: string | null;
}) {
  const [apiRes, setApiRes] = useState("");

  const [loading, setLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);

  async function deleteDeck(action: string) {
    if (action === "deck") {
      setLockButton(true);
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/deck/${deckId}`,
          {
            withCredentials: true,
          },
        );

        setApiRes(response.data.message);
        setLoading(false);

        setTimeout(() => {
          setLockButton(false);
          setApiRes("");
          setDeleteDeckTab(false);
          window.location.replace("/profile");
        }, 2000);
      } catch (error: any) {
        console.log(error.response);
        setApiRes("Internal server error.");
      }
    }

    if (action === "card") {
      setLockButton(true);
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/card/${cardId}`,
          {
            withCredentials: true,
          },
        );

        setApiRes(response.data.message);
        setLoading(false);

        setTimeout(() => {
          setLockButton(false);
          setApiRes("");
          setDeleteDeckTab(false);
          window.location.reload();
        }, 2000);
      } catch (error: any) {
        console.log(error.response);
        setApiRes("Internal server error.");
      }
    }
  }

  return (
    <div className="fixed w-full h-screen bg-black/50 top-0 left-0 z-30 flex justify-center items-center">
      {deleteAction === "deck" && (
        <div className="border border-border transition bg-white rounded-2xl max-w-100 grow mx-5 p-5">
          <p className="text-center mb-5 font-display font-bold text-[1.1rem]">
            {apiRes
              ? apiRes
              : `Are you sure you want to delete this deck? You won't be able to revert
          this action!`}
          </p>
          <div className="flex gap-2 max-sm:flex-col">
            <button
              disabled={lockButton}
              onClick={() => deleteDeck("deck")}
              className={`border-2 border-dark bg-red font-semibold py-2 px-6 rounded-full text-[0.8rem] transition hover:opacity-90 w-1/2 hover:cursor-pointer max-md:w-full ${lockButton && "opacity-50 hover:opacity-50! hover:cursor-default!"}`}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              disabled={lockButton}
              onClick={() => setDeleteDeckTab(false)}
              className={`border-2 border-dark bg-cream font-semibold py-2 px-6 rounded-full text-[0.8rem] transition hover:opacity-70 w-1/2 hover:cursor-pointer max-md:w-full ${lockButton && "opacity-50 hover:opacity-50! hover:cursor-default!"}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteAction === "card" && (
        <div className="border border-border transition bg-white rounded-2xl max-w-100 grow mx-5 p-5">
          <p className="text-center mb-5 font-display font-bold text-[1.1rem]">
            {apiRes
              ? apiRes
              : `Are you sure you want to delete this card? You won't be able to revert
          this action!`}
          </p>
          <div className="flex gap-2 max-sm:flex-col">
            <button
              disabled={lockButton}
              onClick={() => deleteDeck("card")}
              className={`border-2 border-dark bg-red font-semibold py-2 px-6 rounded-full text-[0.8rem] transition hover:opacity-90 w-1/2 hover:cursor-pointer max-md:w-full ${lockButton && "opacity-50 hover:opacity-50! hover:cursor-default!"}`}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              disabled={lockButton}
              onClick={() => setDeleteDeckTab(false)}
              className={`border-2 border-dark bg-cream font-semibold py-2 px-6 rounded-full text-[0.8rem] transition hover:opacity-70 w-1/2 hover:cursor-pointer max-md:w-full ${lockButton && "opacity-50 hover:opacity-50! hover:cursor-default!"}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
