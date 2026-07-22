import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { SetStateAction } from "react";

export default function SideMenu({
  sidebarActive,
  setSidebarActive,
  logout,
}: {
  sidebarActive: boolean;
  logout: () => void;
  setSidebarActive: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <div
      className={`left-0 ${sidebarActive ? "translate-x-0" : "-translate-x-full"} fixed hidden transition-transform duration-400 max-md:flex flex-col justify-between top-0 h-full w-[70%]  gap-1 border-r border-border bg-white py-3 px-5 z-999`}
    >
      <div className="flex flex-col gap-1 *:text-[1.1rem] *:border *:border-white *:rounded-full *:py-1 *:px-4  *:transition *:text-center">
        <Link
          to="/"
          className={`${pathname === "/" && "border-dark! bg-yellow"}`}
          onClick={() => setSidebarActive(false)}
        >
          Home
        </Link>
        <Link
          to="/study"
          className={`${pathname === "/study" && "border-dark! bg-yellow"}`}
          onClick={() => setSidebarActive(false)}
        >
          Study Mode
        </Link>
        {user && (
          <Link
            to="/create"
            className={`${pathname === "/create" && "border-dark! bg-yellow"}`}
            onClick={() => setSidebarActive(false)}
          >
            New Card
          </Link>
        )}
        {user && (
          <Link
            to="/profile"
            className={`${pathname === "/profile" && "border-dark! bg-yellow"}`}
            onClick={() => setSidebarActive(false)}
          >
            My Decks
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-2 *:rounded-full">
        {user ? (
          <>
            <p className="font-display font-bold text-[1.2rem] text-center">
              Ready to study, {user.username}?
            </p>
            <Link
              to={"/profile"}
              className="text-center border border-dark bg-yellow rounded-md py-1 px-10 text-[1.1rem] transition hover:cursor-pointer  hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
              onClick={() => setSidebarActive(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setSidebarActive(false);
              }}
              className="text-center border border-dark bg-red rounded-md py-1 px-10 text-[1.1rem] transition hover:cursor-pointer hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="font-display font-bold text-[1.2rem]  text-center">
              Welcome! <span className="text-teal">Login</span> or{" "}
              <span className="text-teal">Register</span> an account to start
              studying.
            </p>
            <Link
              to={"/login"}
              className="text-center border border-dark bg-blue rounded-md py-1 px-10 text-[1.1rem] transition hover:cursor-pointer hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
              onClick={() => setSidebarActive(false)}
            >
              Login
            </Link>
            <Link
              to={"/register"}
              className="text-center border border-dark bg-blue rounded-md py-1 px-10 text-[1.1rem] transition hover:cursor-pointer hover:-translate-0.5 hover:shadow-[2px_2px_0_black]"
              onClick={() => setSidebarActive(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
