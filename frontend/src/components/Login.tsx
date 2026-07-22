import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrongInfo, setWrongInfo] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [apiRes, setApiRes] = useState("");
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const [validCredentials, setValidCredentials] = useState<{
    username: boolean;
    password: boolean;
  }>({
    username: true,
    password: true,
  });

  useEffect(() => {
    if (username === "" || password === "") {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  }, [username, password]);

  async function validateCredentials() {
    if (!username) {
      setValidCredentials((prev) => ({ ...prev, username: false }));
    } else {
      setValidCredentials((prev) => ({ ...prev, username: true }));
    }

    if (!password) {
      setValidCredentials((prev) => ({ ...prev, password: false }));
      return;
    } else {
      setValidCredentials((prev) => ({ ...prev, password: true }));
    }

    setDisableBtn(true);
    setLoadingBtn(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      if (!user && response.data) {
        setUser(response.data);
        navigate("/profile");
      }
    } catch (error: unknown) {
      setLoadingBtn(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setApiRes(error.response?.data);
          setPassword("");

          setWrongInfo(true);
          setTimeout(() => {
            setWrongInfo(false);
          }, 1000);
        } else {
          setApiRes("Internal server error. Try again later.");
          setPassword("");

          setWrongInfo(true);
          setTimeout(() => {
            setWrongInfo(false);
          }, 1000);
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center px-5 min-h-[80vh]">
      <div className="border-2 border-dark rounded-2xl shadow-[5px_5px_0px_black] bg-white p-8 grow max-w-md">
        <h3
          className={`font-display font-bold text-3xl transition ease-out duration-200 ${wrongInfo && "text-red"}`}
        >
          {!apiRes ? "Welcome back" : apiRes}
        </h3>
        <p className="text-brown mt-2">Sign in or create your account</p>

        <div className="flex gap-1 border border-border bg-cream rounded-md p-1 my-5">
          <Link
            to={"/login"}
            className="border border-border bg-white rounded-md text-[0.9rem] w-1/2 text-center py-1 "
          >
            Log in
          </Link>
          <Link
            to={"/register"}
            className="rounded-md text-[0.9rem] w-1/2 text-center py-1"
          >
            Register
          </Link>
        </div>

        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label
            htmlFor="login-username"
            className={`text-[0.9rem] mb-1 ${!validCredentials.username && "text-red"}`}
          >
            Username
          </label>
          <input
            required
            onChange={(e) => setUsername(e.target.value.trim())}
            value={username}
            placeholder="your_username"
            type="text"
            id="login-username"
            className={`border border-border bg-cream rounded-md py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark mb-4 text-[0.9rem] ${!validCredentials.username && "border-red!"}`}
          />

          <label
            htmlFor="login-password"
            className={`text-[0.9rem] mb-1 ${!validCredentials.password && "text-red"}`}
          >
            Password
          </label>
          <input
            required
            onChange={(e) => setPassword(e.target.value.trim())}
            value={password}
            placeholder="********"
            type="password"
            id="login-password"
            className={`border border-border bg-cream rounded-md py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark  text-[0.9rem] ${!validCredentials.password && "border-red!"}`}
          />
          <Link to={"/recover"} className="mb-6 mt-1 text-[0.8rem] underline">
            Forgot your password?
          </Link>

          <button
            disabled={disableBtn}
            className={`border border-dark bg-yellow w-full rounded-full py-2 transition ${!disableBtn ? "hover:cursor-pointer hover:-translate-1 hover:shadow-[3px_3px_0px_black]" : "opacity-30"} ${loadingBtn && "opacity-90 animate-pulse"}`}
            onClick={() => validateCredentials()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                validateCredentials();
              }
            }}
          >
            {!loadingBtn ? "Log in" : "Loading..."}
          </button>
        </form>
      </div>
    </div>
  );
}
