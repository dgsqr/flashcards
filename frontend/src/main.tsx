import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./contexts/AuthContext.tsx";
import { DeckProvider } from "./contexts/DeckContext";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DeckProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </DeckProvider>
  </StrictMode>,
);
