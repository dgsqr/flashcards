import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [apiRes, setApiRes] = useState("");
  const [wrongInfo, setWrongInfo] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [validCredentials, setValidCredentials] = useState<{
    username: string;
    password: string;
    recoveryCode: string;
  }>({
    username: "",
    password: "",
    recoveryCode: "",
  });

  useEffect(() => {
    if (username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!username || !usernameRegex.test(username)) {
        setValidCredentials((prev) => ({ ...prev, username: "invalid" }));
      } else {
        setValidCredentials((prev) => ({ ...prev, username: "valid" }));
      }
    } else {
      setValidCredentials((prev) => ({ ...prev, username: "" }));
    }

    if (password) {
      const passwordRegex = /^.{8,16}$/;
      if (!password || !passwordRegex.test(password)) {
        setValidCredentials((prev) => ({ ...prev, password: "invalid" }));
      } else {
        setValidCredentials((prev) => ({ ...prev, password: "valid" }));
      }
    } else {
      setValidCredentials((prev) => ({ ...prev, password: "" }));
    }

    if (recoveryCode) {
      const recoveryRegex = /^\d{4}$/;
      if (!recoveryCode || !recoveryRegex.test(recoveryCode)) {
        setValidCredentials((prev) => ({ ...prev, recoveryCode: "invalid" }));
      } else {
        setValidCredentials((prev) => ({ ...prev, recoveryCode: "valid" }));
      }
    } else {
      setValidCredentials((prev) => ({ ...prev, recoveryCode: "" }));
    }
  }, [username, password, recoveryCode]);

  useEffect(() => {
    if (
      validCredentials.username === "valid" &&
      validCredentials.password === "valid" &&
      validCredentials.recoveryCode === "valid"
    ) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [validCredentials]);

  async function register() {
    setLoadingBtn(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          username,
          password,
          recoveryCode,
        },
        {
          withCredentials: true,
        },
      );

      if (!user && response.data) {
        setUser(response.data);
        navigate("/profile");
      }
    } catch (error) {
      setLoadingBtn(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setApiRes(error.response?.data);
          setUsername("");

          setWrongInfo(true);
          setTimeout(() => {
            setWrongInfo(false);
          }, 1000);
        } else {
          setApiRes("Internal server error. Try again later.");

          setWrongInfo(true);
          setTimeout(() => {
            setWrongInfo(false);
          }, 1000);
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center px-5 min-h-[90vh]">
      <div className="border-2 border-dark rounded-2xl shadow-[5px_5px_0px_black] bg-white p-8 grow max-w-md">
        <h3
          className={`font-display font-bold text-3xl ease transition  ${wrongInfo && "text-red"}`}
        >
          {!apiRes ? "Create your account" : apiRes}
        </h3>
        <p className="text-brown mt-2">Sign in or create your account</p>

        <div className="flex gap-1 border border-border bg-cream rounded-md p-1 my-5">
          <Link
            to={"/login"}
            className="rounded-md text-[0.9rem] w-1/2 text-center py-1 "
          >
            Log in
          </Link>
          <Link
            to={"/register"}
            className="border border-border bg-white rounded-md text-[0.9rem] w-1/2 text-center py-1"
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
            htmlFor="register-username"
            className={`text-[0.9rem] mb-1 ${validCredentials.username === "invalid" && "text-red"} ${validCredentials.username === "valid" && "text-green-500"}`}
          >
            Username
          </label>
          <input
            required
            onChange={(e) => setUsername(e.target.value.trim())}
            value={username}
            placeholder="your_username"
            type="text"
            id="register-username"
            className={`border border-border bg-cream rounded-md py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark text-[0.9rem] ${validCredentials.username === "invalid" && "border-red!"} ${validCredentials.username === "valid" && "border-green-500!"}`}
          />
          <div className="mb-4 mt-1 text-[0.8rem]">
            <p>3-20 Characters long | Aa-Zz, 0-9 or _</p>
          </div>

          <label
            htmlFor="register-password"
            className={`text-[0.9rem] mb-1 ${validCredentials.password === "invalid" && "text-red"} ${validCredentials.password === "valid" && "text-green-500"}`}
          >
            Password
          </label>
          <input
            required
            onChange={(e) => setPassword(e.target.value.trim())}
            value={password}
            placeholder="********"
            type="password"
            id="register-password"
            className={`border border-border bg-cream rounded-md py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark text-[0.9rem] ${validCredentials.password === "invalid" && "border-red!"} ${validCredentials.password === "valid" && "border-green-500!"}`}
          />
          <div className="mb-4 mt-1 text-[0.8rem]">
            <p>8-16 Characters long</p>
          </div>

          <label
            htmlFor="register-recovery"
            className={`text-[0.9rem] mb-1 ${validCredentials.recoveryCode === "invalid" && "text-red"} ${validCredentials.recoveryCode === "valid" && "text-green-500"}`}
          >
            Recovery code
          </label>
          <input
            required
            onChange={(e) => setRecoveryCode(e.target.value.trim().slice(0, 4))}
            value={recoveryCode}
            minLength={4}
            maxLength={4}
            placeholder="1234"
            type="number"
            id="register-recovery"
            className={`border border-border bg-cream rounded-md py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark text-[0.9rem] ${validCredentials.recoveryCode === "invalid" && "border-red!"} ${validCredentials.recoveryCode === "valid" && "border-green-500!"}`}
          />
          <div className="mb-4 mt-1 text-[0.8rem]">
            <p>This code will be used to recover your password</p>
          </div>

          <button
            disabled={disableBtn}
            className={`border border-dark bg-yellow w-full rounded-full py-2 transition ${!disableBtn ? "hover:cursor-pointer hover:-translate-1 hover:shadow-[3px_3px_0px_black]" : "opacity-30"} ${loadingBtn && "opacity-90 animate-pulse"}`}
            onClick={() => register()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                register();
              }
            }}
          >
            {!loadingBtn ? "Register" : "Loading..."}
          </button>
        </form>
      </div>
    </div>
  );
}
