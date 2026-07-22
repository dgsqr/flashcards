import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SelectDeck() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="rounded-lg p-6 max-w-lg m-auto min-h-[60vh] flex flex-col justify-center select-none">
      <div className="text-center flex flex-col items-center mb-10">
        <p className="relative font-display font-bold text-4xl mb-3 max-w-sm">
          Select a deck and start studying!
        </p>
        <p className="text-brown text-[1.2rem] max-w-sm">
          Jump back into a deck you own, or borrow one of ours to warm up.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          className="border-2 border-dark bg-yellow py-3 rounded-lg px-6 -translate-1 shadow-[2px_3px_0px_black] hover:cursor-pointer hover:translate-0 hover:shadow-none transition flex items-center gap-2"
          onClick={() => {
            if (user) {
              navigate("/profile");
            } else {
              navigate("/login");
            }
          }}
        >
          <div className="flex justify-center items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M130-189 81-546q-5-32 15.5-58t52.5-31l61 435 283-40h267q-8 21-24.5 35.5T695-187l-477 66q-33 5-58-15t-30-53Zm190-127q-33 0-56.5-23.5T240-396v-364q0-33 23.5-56.5T320-840h480q33 0 56.5 23.5T880-760v364q0 33-23.5 56.5T800-316H320Zm0-80h480v-364H320v364Zm0 0v-364 364ZM210-200Zm190-400h320v-80H400v80Zm0 120h200v-80H400v80Z" />
            </svg>
            <div className="flex flex-col items-start">
              <p className="font-semibold">Your Decks</p>
              <p className="text-[0.8rem] ">Select from your own decks</p>
            </div>
          </div>
        </button>

        <button
          className="border-2 border-dark bg-blue-300 rounded-lg py-3 px-6 text-[0.9rem] -translate-1 shadow-[2px_3px_0px_black] hover:cursor-pointer hover:translate-0 hover:shadow-none transition flex items-center gap-2 "
          onClick={() => navigate("/demo")}
        >
          <div className="flex justify-center items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M272-120 64-480l208-360h416l208 360-208 360H272Zm46-80h324l161-280-161-280H318L156-480l162 280Zm162-280Z" />
            </svg>
            <div className="flex flex-col items-start">
              <p className="font-semibold">Demo Decks</p>
              <p className="text-[0.8rem]">Ready-made, no setup needed</p>
            </div>
          </div>
        </button>

        <button
          className="border-2 border-dark bg-gray-300 rounded-lg py-3 px-6 text-[0.9rem] -translate-1 shadow-[2px_3px_0px_black] hover:cursor-pointer hover:translate-0 hover:shadow-none transition flex items-center gap-2 "
          onClick={() => {
            if (user) {
              navigate("/create");
            } else {
              navigate("/login");
            }
          }}
        >
          <div className="flex justify-center items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
            </svg>
            <div className="flex flex-col items-start">
              <p className="font-semibold">Create a new deck</p>
              <p className="text-[0.8rem]">
                Add a new deck to your collection!
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
