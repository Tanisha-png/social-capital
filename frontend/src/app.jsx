// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import NavBar from "./components/NavBar/NavBar.jsx";
// import LoginPage from "./pages/LoginPage";
// import ProfilePage from "./pages/ProfilePage";
// import MessagesPage from "./pages/MessagesPage";
// import { useAuth } from "./contexts/AuthContext";

// export default function App() {
//     const { user } = useAuth();

//     return (
//         <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route
//             path="/profile/:id"
//             element={user ? <ProfilePage /> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/messages"
//             element={user ? <MessagesPage /> : <Navigate to="/login" />}
//         />
//         <Route
//             path="*"
//             element={<Navigate to={user ? `/profile/${user.id}` : "/login"} />}
//         />
//         </Routes>
//     );
//     }

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// // import { NavBar } from "./components/NavBar/NavBar";
// import NavBar from "./components/NavBar/NavBar";
// import LoginPage from "./pages/LoginPage";
// import ProfilePage from "./pages/ProfilePage";
// import MessagesPage from "./pages/MessagesPage";
// import { useAuth } from "./contexts/AuthContext";

// export default function App() {
//     const { user, isLoading } = useAuth();

//     if (isLoading) return <p>Loading...</p>; // Wait until auth state is ready

//     return (
//         <Routes>
//             {/* Public route */}
//             <Route
//             path="/login"
//             element={
//                 user ? (
//                 <Navigate to={`/profile/${user.id}`} />
//                 ) : (
//                 <LoginPage setUser={setUser} />
//                 )
//             }
//         />

//         {/* Protected routes */}
//         {/* <Route
//             path="/profile/:id"
//             element={user ? <ProfilePage /> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/messages"
//             element={user ? <MessagesPage /> : <Navigate to="/login" />}
//         /> */}
//         <Route
//           path="/profile/:id"
//           element={user ? <ProfilePage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/messages"
//           element={user ? <MessagesPage /> : <Navigate to="/login" />}
//         />

//         {/* Catch-all: redirect to profile if logged in, otherwise login */}
//         <Route
//           path="*"
//           element={<Navigate to={user ? `/profile/${user.id}` : "/login"} />}
//         />
//         <Route
//           path="/posts"
//           element={user ? <div>Post List Page</div> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/posts/new"
//           element={user ? <div>New Post Page</div> : <Navigate to="/login" />}
//         />
//       </Routes>
//     );
// }

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "../LoginPage";
// import ProfilePage from "../ProfilePage";
// import MessagesPage from "../MessagesPage";
// import { useAuth } from "../../contexts/AuthContext";
// import NavBar from "../../components/NavBar/NavBar";

// export default function App() {
//   const { user, setUser, isLoading } = useAuth();

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <>
//       <NavBar />
//       <Routes>
//         <Route
//           path="/login"
//           element={
//             user ? (
//               <Navigate to={`/profile/${user.id}`} />
//             ) : (
//               <LoginPage setUser={setUser} />
//             )
//           }
//         />
//         <Route
//           path="/profile/:id"
//           element={user ? <ProfilePage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/messages"
//           element={user ? <MessagesPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/posts"
//           element={user ? <div>Post List Page</div> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/posts/new"
//           element={user ? <div>New Post Page</div> : <Navigate to="/login" />}
//         />
//         <Route
//           path="*"
//           element={<Navigate to={user ? `/profile/${user.id}` : "/login"} />}
//         />
//       </Routes>
//     </>
//   );
// }

// ✅ App.jsx (fixed)
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "../LoginPage";
// import ProfilePage from "../ProfilePage";
// import MessagesPage from "../MessagesPage";
// import { useAuth } from "../../contexts/AuthContext";
// import NavBar from "../../components/NavBar/NavBar";

// export default function App() {
//   const { user, setUser, isLoading } = useAuth();

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <>
//       <NavBar />
//       <Routes>
//         <Route
//           path="/login"
//           element={user ? <Navigate to={`/profile/${user.id}`} /> : <LoginPage setUser={setUser} />}
//         />
//         <Route path="/profile/:id" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
//         <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
//         <Route path="/posts" element={user ? <div>Post List Page</div> : <Navigate to="/login" />} />
//         <Route path="/posts/new" element={user ? <div>New Post Page</div> : <Navigate to="/login" />} />
//         <Route path="*" element={<Navigate to={user ? `/profile/${user.id}` : "/login"} />} />
//       </Routes>
//     </>
//   );
// }


import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

// 🔒 Private Route wrapper
function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
    <AuthProvider>
        <Router>
            <NavBar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

          {/* Profile route is protected */}
        <Route
            path="/profile"
            element={
                <PrivateRoute>
                    <ProfilePage />
                </PrivateRoute>
            }
            />

          {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    </AuthProvider>
    );
}
