import { Buffer } from "buffer";
window.Buffer = Buffer;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { DarkModeProvider } from "./utils/darkmodecontext.jsx";
import AuthProvider from "./utils/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <DarkModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DarkModeProvider>
  </BrowserRouter>
  // </StrictMode>
);
