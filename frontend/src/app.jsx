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


// // === src/App.jsx ===
// import React from "react";
// import {
//     BrowserRouter as Router,
//     Routes,
//     Route,
//     Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import NavBar from "./components/NavBar/NavBar";
// import HomePage from "./pages/HomePage/HomePage";
// import LoginPage from "./pages/LoginPage/LoginPage";
// import SignUpPage from "./pages/SignUpPage/SignUpPage";
// import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import "./App.css";

// // 🔒 Private Route wrapper
// function PrivateRoute({ children }) {
//     const { user } = useAuth();
//     return user ? children : <Navigate to="/login" />;
// }

// export default function App() {
//     return (
//         <AuthProvider>
//         <Router>
//             <div className="page-container">
//             <NavBar />
//             <div className="content-wrap">
//                 <Routes>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/signup" element={<SignUpPage />} />

//                 {/* Protected Profile route */}
//                 <Route
//                     path="/profile"
//                     element={
//                     <PrivateRoute>
//                         <ProfilePage />
//                     </PrivateRoute>
//                     }
//                 />

//                 {/* fallback */}
//                 <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//             </div>
//             <footer className="footer">
//                 <p>© {new Date().getFullYear()} Social Capital. All rights reserved.</p>
//             </footer>
//             </div>
//         </Router>
//         </AuthProvider>
//     );
// }

// src/App.jsx
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
import PostListPage from "./pages/PostListPage/PostListPage";
import NewPostPage from "./pages/NewPostPage/NewPostPage";
import MessagesPage from "./pages/MessagesPage/MessagesPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
// import UserSearchPage from "./pages/UserSearchPage/UserSearchPage";
import "./App.css";

// 🔒 Reusable Private Route
function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <AuthProvider>
        <Router>
            <div className="page-container">
            <NavBar />
            <div className="content-wrap">
                <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/search" element={<PrivateRoute element={<SearchPage />} />} />

                {/* Private */}
                <Route
                    path="/profile"
                    element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                    }
                />
                <Route
                    path="/posts"
                    element={
                    <PrivateRoute>
                        <PostListPage />
                    </PrivateRoute>
                    }
                />
                <Route
                    path="/posts/new"
                    element={
                    <PrivateRoute>
                        <NewPostPage />
                    </PrivateRoute>
                    }
                />
                <Route
                    path="/messages"
                    element={
                    <PrivateRoute>
                        <MessagesPage />
                    </PrivateRoute>
                    }
                />
                <Route
                    path="/friends"
                    element={
                    <PrivateRoute>
                        <FriendsPage />
                    </PrivateRoute>
                    }
                />
                {/* <Route
                    path="/search"
                    element={
                    <PrivateRoute>
                        <UserSearchPage />
                    </PrivateRoute>
                    }
                /> */}

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>

            <footer className="footer">
                <p>© {new Date().getFullYear()} Social Capital. All rights reserved.</p>
            </footer>
            </div>
        </Router>
        </AuthProvider>
    );
}
