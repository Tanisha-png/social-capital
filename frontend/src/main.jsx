
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/socketContext";
import { MessageProvider } from "./context/MessageContext";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AuthProvider>
//       <NotificationProvider>
//         <SocketProvider>
//           <MessageProvider>
//             <BrowserRouter>
//               <App />
//             </BrowserRouter>
//           </MessageProvider>
//         </SocketProvider>
//       </NotificationProvider>
//     </AuthProvider>
//   </StrictMode>
// );

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <MessageProvider>
              <App />
            </MessageProvider>
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

