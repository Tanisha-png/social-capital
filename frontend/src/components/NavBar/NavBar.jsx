// import { NavLink, Link, useNavigate } from 'react-router';
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// // import { logOut } from '../../services/authService';
// import './NavBar.css';

// export default function NavBar({ user, setUser }) {
//   const navigate = useNavigate();

//   function handleLogOut() {
//     logOut();
//     setUser(null);
//     navigate('/');
//   }

//   return (
//     <nav className="NavBar">
//       <NavLink to="/">Home</NavLink>
//       &nbsp; | &nbsp;
//       {user ? (
//         <>
//           <NavLink to="/posts" end>
//             Post List
//           </NavLink>
//           &nbsp; | &nbsp;
//           <NavLink to="/posts/new">New Post</NavLink>
//           &nbsp; | &nbsp;
//           <button onClick={handleLogOut}>Log Out</button>
//           &nbsp; | &nbsp;
//           <span>Welcome, {user.name}</span>
//         </>
//       ) : (
//         <>
//           <NavLink to="/login">Log In</NavLink>
//           &nbsp; | &nbsp;
//           <NavLink to="/signup">Sign Up</NavLink>
//         </>
//       )}
//     </nav>
//   );
// }

// export default function NavBar() {
//   const { user, logOut } = useAuth();
//   const navigate = useNavigate();

//   const handleLogOut = () => {
//     logOut(); // remove token & user from localStorage
//     setUser(null); // clear user state in App
//     navigate("/login"); // redirect to login page
//   };

//   return (
//     <nav className="NavBar">
//       <NavLink to="/" end>
//         Home
//       </NavLink>
//       &nbsp;|&nbsp;
//       {user ? (
//         <>
//           <NavLink to={`/profile/${user.id}`}>Profile</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink to="/posts">Posts</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink to="/posts/new">New Post</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink to="#" onClick={handleLogOut}>
//             Logout
//           </NavLink>
//           &nbsp;|&nbsp;
//           <span
//             onClick={handleLogOut}
//             className="NavBar-link"
//             style={{ cursor: "pointer" }}
//           >
//             Log Out
//           </span>
//           &nbsp;|&nbsp;
//           <span>Welcome, {user.name}</span>
//         </>
//       ) : (
//         <>
//           <NavLink to="/login">Log In</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink to="/signup">Sign Up</NavLink>
//         </>
//       )}
//     </nav>
//   );
// }

// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import "./NavBar.css";

// export default function NavBar() {
//   const { user, logOut } = useAuth(); // ✅ only from context
//   const navigate = useNavigate();

//   const handleLogOut = () => {
//     logOut(); // ✅ clears auth state in context
//     navigate("/login"); // ✅ redirect to login
//   };

//   return (
//     <nav className="NavBar">
//       <NavLink to="/" end>
//         Home
//       </NavLink>
//       &nbsp;|&nbsp;
//       {user ? (
//         <>
//           <NavLink to={`/profile/${user.id}`}>Profile</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink to="/posts">Posts</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink to="/posts/new">New Post</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink
//             to="/login"
//             onClick={(e) => {
//               e.preventDefault();
//               handleLogOut();
//             }}
//           >
//             Logout
//           </NavLink>
//           &nbsp;|&nbsp;
//           <span>Welcome, {user.name}</span>
//         </>
//       ) : (
//         <>
//           <NavLink to="/login">Log In</NavLink>
//           &nbsp;|&nbsp;
//           <NavLink to="/signup">Sign Up</NavLink>
//         </>
//       )}
//     </nav>
//   );
// }

// === src/components/NavBar/NavBar.jsx ===
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./NavBar.css";

export default function NavBar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const displayName = user?.firstName || user?.name || user?.email;

  console.log("NavBar user from context:", user);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          Social Capital
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            {/* <span className="nav-username">{user.firstName}</span> */}
            <span className="nav-username">{displayName}</span>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">
              Login
            </Link>
            <Link to="/signup" className="nav-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
