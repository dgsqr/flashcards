import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import SideMenu from "./SideMenu";
import axios from "axios";

export default function Header() {
  const { user, setUser } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [activeProfile, setActiveProfile] = useState<boolean>(false);
  const [sidebarActive, setSidebarActive] = useState<boolean>(false);

  const profileTab = useRef<HTMLDivElement | null>(null);

  async function logout() {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
      window.location.pathname = "/";
      setActiveProfile(false);
      setSidebarActive(false);
    } catch (error) {
      window.alert("Internal server error");
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        profileTab.current &&
        !profileTab.current.contains(e.target as Node)
      ) {
        setActiveProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <header className=" border-b border-border py-2 select-none px-5 ">
      <div className="relative flex items-center justify-between max-w-6xl m-auto">
        <h1
          onClick={() => navigate("/")}
          className="font-display font-bold text-2xl text-dark hover:cursor-pointer"
        >
          Flashcards
        </h1>

        <nav className="flex items-center justify-center gap-1 border border-border bg-white rounded-full p-1 *:text-[0.9rem] *:border *:border-white *:rounded-full *:py-1 *:px-4  *:transition max-md:hidden">
          <Link
            to="/"
            className={`${pathname === "/" && "border-dark! bg-yellow"} `}
          >
            Home
          </Link>
          <Link
            to="/study"
            className={pathname === "/study" ? "border-dark! bg-yellow" : ""}
          >
            Study Mode
          </Link>
          <Link
            to={`${user ? "/create" : "/login"}`}
            className={pathname === "/create" ? "border-dark! bg-yellow" : ""}
          >
            New Card
          </Link>

          <Link
            to={`${user ? "/profile" : "/login"}`}
            className={pathname === "/profile" ? "border-dark! bg-yellow" : ""}
          >
            My Decks
          </Link>
        </nav>

        <button
          className="border border-border rounded-full bg-white flex justify-center align-center p-2 hover:cursor-pointer transition max-md:hidden"
          onClick={() => {
            setActiveProfile(!activeProfile);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
          </svg>
        </button>

        <button
          className={`border-2 border-border rounded-sm bg-white hidden max-md:flex justify-center align-center p-1.5 *:scale-130 hover:cursor-pointer *:transition ${sidebarActive ? "*:rotate-90" : "*:rotate-0"}`}
          onClick={() => {
            setSidebarActive(!sidebarActive);
          }}
        >
          {!sidebarActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1a1209"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1a1209"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          )}
        </button>

        <div
          ref={profileTab}
          className={`dropdown-animation absolute flex-col gap-1 right-0 top-[130%] bg-white border border-border rounded-md py-4 px-4 max-w-75 overflow-hidden shadow-sm ${activeProfile ? "flex" : "hidden"} max-md:hidden z-999`}
        >
          {user ? (
            <>
              <p className="font-display font-bold text-[1rem] ">
                Ready to study, {user.username}?
              </p>
              <Link
                to={"/profile"}
                className="text-center border border-dark bg-yellow rounded-md py-1 px-10 text-[0.9rem] transition hover:cursor-pointer  hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
                onClick={() => {
                  setActiveProfile(false);
                }}
              >
                Profile
              </Link>
              <button
                className="text-center border border-dark bg-red rounded-md py-1 px-10 text-[0.9rem] transition hover:cursor-pointer hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <p className="font-display font-bold text-[1rem] max-w-2xs">
                Welcome! <span className="text-teal">Login</span> or{" "}
                <span className="text-teal">Register</span> an account to start
                studying.
              </p>
              <Link
                to={"/login"}
                className="text-center border border-dark bg-yellow rounded-md py-1 px-10 text-[0.9rem] transition hover:cursor-pointer hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
                onClick={() => {
                  setActiveProfile(false);
                }}
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className="text-center border border-dark bg-yellow rounded-md py-1 px-10 text-[0.9rem] transition hover:cursor-pointer hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
                onClick={() => {
                  setActiveProfile(false);
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <SideMenu
        sidebarActive={sidebarActive}
        logout={logout}
        setSidebarActive={setSidebarActive}
      />
    </header>
  );
}
