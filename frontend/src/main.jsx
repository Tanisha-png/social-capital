import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router';
import { BrowserRouter } from "react-router-dom";
import './index.css';
// import App from './pages/App/App.jsx';
// import App from "./pages/App/App";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/socketContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        {/* <BrowserRouter> */}
          <App />
        {/* </BrowserRouter> */}
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
