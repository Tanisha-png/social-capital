//
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import ProfilePage from "./pages/ProfilePage";
// import MessagesPage from "./pages/MessagesPage";
// import { useAuth } from "./contexts/AuthContext";

// export default function App() {
//     const { user, isLoading } = useAuth();

//     if (isLoading) return <p>Loading...</p>;

//     return (
//         <Routes>
//         {/* Public route */}
//         <Route
//             path="/login"
//             element={user ? <Navigate to={`/profile/${user.id}`} /> : <LoginPage />}
//         />

//         {/* Protected routes */}
//         <Route
//             path="/profile/:id"
//             element={user ? <ProfilePage /> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/messages"
//             element={user ? <MessagesPage /> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/posts"
//             element={user ? <div>Post List Page</div> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/posts/new"
//             element={user ? <div>New Post Page</div> : <Navigate to="/login" />}
//         />

//         {/* Catch-all */}
//         <Route
//             path="*"
//             element={<Navigate to={user ? `/profile/${user.id}` : "/login"} />}
//         />
//         </Routes>
//     );
// }

import React from "react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
    const { id } = useParams();

    return (
        <div>
        <h2>Profile Page</h2>
        <p>User ID: {id}</p>
        </div>
    );
}
