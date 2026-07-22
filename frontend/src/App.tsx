import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Recover from "./components/Recover";
import Home from "./components/Home";
import Study from "./components/Study";
import Demo from "./components/Demo";
import Profile from "./components/Profile";
import Create from "./components/Create";
import DeckSettings from "./components/DeckSettings";
import { useLayoutEffect } from "react";

function App() {
  useLayoutEffect(() => {
    async function wakeupServer() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ping`);
        const data = response.json();
        console.log(data);
      } catch (error: any) {
        console.log(error);
      }
    }
    wakeupServer();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recover" element={<Recover />} />
          <Route path="/study" element={<Study />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/deck-settings/:id" element={<DeckSettings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
