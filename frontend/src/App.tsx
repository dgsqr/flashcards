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
import { useLayoutEffect, useState } from "react";
import LoadingApp from "./components/LoadingApp";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    async function wakeupServer() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/ping`,
        );
        console.log(response.data);
        setLoading(false);
      } catch (error: any) {
        console.log(error);
      }
    }
    wakeupServer();
  }, []);

  return (
    <>
      {loading && <LoadingApp />}
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
