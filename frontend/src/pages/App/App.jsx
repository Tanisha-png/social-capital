// import { useState, useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { getUser, logOut } from "../../services/authService";
// import "./App.css";
// import HomePage from "../HomePage/HomePage";
// import PostListPage from "../PostListPage/PostListPage";
// import NewPostPage from "../NewPostPage/NewPostPage";
// import SignUpPage from "../SignUpPage/SignUpPage";
// import LogInPage from "../LogInPage/LogInPage";
// import NavBar from "../../components/NavBar/NavBar";

// export default function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     setUser(getUser()); // load user from localStorage on mount
//   }, []);

//   return (
//     <main className="App">
//       <NavBar user={user} setUser={setUser} />

//       <section id="main-section">
//         <Routes>
//           {/* Public routes */}
//           <Route
//             path="/login"
//             element={
//               !user ? <LogInPage setUser={setUser} /> : <Navigate to="/" />
//             }
//           />
//           <Route
//             path="/signup"
//             element={
//               !user ? <SignUpPage setUser={setUser} /> : <Navigate to="/" />
//             }
//           />

//           {/* Protected routes */}
//           <Route
//             path="/"
//             element={user ? <HomePage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/posts"
//             element={user ? <PostListPage /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/posts/new"
//             element={user ? <NewPostPage /> : <Navigate to="/login" />}
//           />

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
//         </Routes>
//       </section>
//     </main>
//   );
// }

import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../../services/authService";
import "./App.css";
import HomePage from "../HomePage/HomePage";
import PostListPage from "../PostListPage/PostListPage";
import NewPostPage from "../NewPostPage/NewPostPage";
import SignUpPage from "../SignUpPage/SignUpPage";
import LogInPage from "../LogInPage/LogInPage";
import ProfilePage from "../ProfilePage/ProfilePage";
import NavBar from "../../components/NavBar/NavBar";

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
          <Route path="/login" element={<LogInPage setUser={setUser} />} />
          {user && (
            <>
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/posts" element={<PostListPage />} />
              <Route path="/posts/new" element={<NewPostPage />} />
            </>
          )}
          <Route
            path="*"
            element={<Navigate to={user ? "/posts" : "/login"} />}
          />
        </Routes>
      </section>
    </main>
  );
}

