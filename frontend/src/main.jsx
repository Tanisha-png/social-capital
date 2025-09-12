
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/socketContext";
import { NotificationProvider } from "./context/NotificationContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);

