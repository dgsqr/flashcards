import { useEffect, useState, type SetStateAction } from "react";
import axios from "axios";

export default function NewDeck({
  setNewDeckTab,
}: {
  setNewDeckTab: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [valid, setValid] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [apiRes, setApiRes] = useState("");

  const [loading, setLoading] = useState(false);

  async function postDeck() {
    setValid(false);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/deck`,
        {
          deckName: deckName.trim(),
        },
        {
          withCredentials: true,
        },
      );
      setDeckName("");

      setApiRes(response.data.message);
      setLoading(false);

      setTimeout(() => {
        setApiRes("");
        setNewDeckTab(false);
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.log(error.response);
      setApiRes("Internal server error.");
    }
  }

  useEffect(() => {
    if (deckName) {
      setValid(true);
    } else setValid(false);
  }, [deckName]);

  return (
    <div className="fixed w-full h-screen bg-black/50 top-0 left-0 z-30 flex justify-center items-center">
      <div className="border border-border transition bg-white rounded-2xl max-w-100 grow mx-5 p-5">
        <p className="font-display font-bold text-lg mb-4">
          {apiRes ? apiRes : "Create a new Deck"}
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
          <label
            htmlFor="deck-name"
            className="font-semibold text-[0.9rem] mb-1 text-dark"
          >
            Deck Name
          </label>
          <input
            maxLength={50}
            placeholder="What are you planning to study?"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            type="text"
            name="deck-name"
            id="deck-name"
            className="border border-border bg-cream w-full rounded-md px-3 py-1 mb-5 text-[0.9rem] focus:outline-3 focus:outline-yellow"
          />
          <div className="flex gap-2 max-sm:flex-col">
            <button
              disabled={!valid}
              onClick={() => {
                if (apiRes) return;
                postDeck();
              }}
              className={`border-2 border-dark bg-yellow font-semibold py-2 px-6 rounded-full text-[0.8rem] transition hover:shadow-none w-1/2 hover:cursor-pointer hover:opacity-90 ${!valid && "hover:cursor-default! opacity-50!"} max-md:w-full`}
            >
              {loading ? "Creating..." : "Submit"}
            </button>
            <button
              onClick={() => setNewDeckTab(false)}
              className={`border-2 border-dark bg-red font-semibold py-2 px-6 rounded-full text-[0.8rem] transition hover:opacity-90 w-1/2 hover:cursor-pointer max-md:w-full`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
