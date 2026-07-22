import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
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
    if (
      username &&
      recoveryCode &&
      password &&
      validCredentials.password === "valid"
    ) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [validCredentials]);

  useEffect(() => {
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

    if (
      username &&
      recoveryCode &&
      password &&
      validCredentials.password === "valid"
    ) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [username, password, recoveryCode]);

  async function recover() {
    setDisableBtn(true);
    setLoadingBtn(true);

    setValidCredentials((prev) => ({
      ...prev,
      username: "",
      recoveryCode: "",
    }));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/recover`,
        {
          username: username,
          recoveryCode: recoveryCode,
          password: password,
        },
      );

      if (response.data) {
        setApiRes(response.data);
        setLoadingBtn(false);
        setPassword("");
        setUsername("");
        setRecoveryCode("");
      }
    } catch (error: unknown) {
      setLoadingBtn(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setApiRes(error.response?.data);
          setUsername("");
          setRecoveryCode("");

          setValidCredentials((prev) => ({
            ...prev,
            username: "invalid",
            recoveryCode: "invalid",
          }));

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
          {!apiRes ? "Forgot your password?" : apiRes}
        </h3>
        <p className="text-brown mt-2">
          With your recovery code you can easily make a new one!
        </p>

        <div className="flex gap-1 border border-border bg-cream rounded-md p-1 my-5">
          <Link
            to={"/login"}
            className="rounded-md text-[0.9rem] w-1/2 text-center py-1 "
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
            htmlFor="recover-username"
            className={`text-[0.9rem] mb-1 ${validCredentials.username === "invalid" && "text-red"}`}
          >
            Username
          </label>
          <input
            required
            onChange={(e) => setUsername(e.target.value.trim())}
            value={username}
            placeholder="your_username"
            type="text"
            id="recover-username"
            className={`border border-border bg-cream rounded-md mb-4 py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark text-[0.9rem] ${validCredentials.username === "invalid" && "border-red!"}`}
          />

          <label
            htmlFor="recover-recovery"
            className={`text-[0.9rem] mb-1 ${validCredentials.recoveryCode === "invalid" && "text-red"} `}
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
            id="recover-recovery"
            className={`border border-border bg-cream rounded-md py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark text-[0.9rem] ${validCredentials.recoveryCode === "invalid" && "border-red!"} `}
          />
          <div className="mb-4 mt-1 text-[0.8rem]">
            <p>Recovery code that you made when you created your account</p>
          </div>

          <label
            htmlFor="recover-password"
            className={`text-[0.9rem] mb-1 ${validCredentials.password === "invalid" && "text-red"} ${validCredentials.password === "valid" && "text-green-500"}`}
          >
            New Password
          </label>
          <input
            required
            onChange={(e) => setPassword(e.target.value.trim())}
            value={password}
            placeholder="********"
            type="text"
            id="recover-password"
            className={`border border-border bg-cream rounded-md py-1.5 px-3 transition focus:bg-white focus:outline-0 focus:border-dark text-[0.9rem] ${validCredentials.password === "invalid" && "border-red!"} ${validCredentials.password === "valid" && "border-green-500!"}`}
          />
          <div className="mb-4 mt-1 text-[0.8rem]">
            <p>8-16 Characters long</p>
          </div>

          <button
            disabled={disableBtn}
            className={`border border-dark bg-yellow w-full rounded-full py-2 transition ${!disableBtn ? "hover:cursor-pointer hover:-translate-1 hover:shadow-[3px_3px_0px_black]" : "opacity-30"} ${loadingBtn && "opacity-90 animate-pulse"}`}
            onClick={() => recover()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                recover();
              }
            }}
          >
            {!loadingBtn ? "Send" : "Loading..."}
          </button>
        </form>
      </div>
    </div>
  );
}
