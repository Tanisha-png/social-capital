// import { NavLink, Link, useNavigate } from 'react-router';
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { logOut } from '../../services/authService';
import './NavBar.css';

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

export default function NavBar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut(); // remove token & user from localStorage
    setUser(null); // clear user state in App
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="NavBar">
      <NavLink to="/" end>
        Home
      </NavLink>
      &nbsp;|&nbsp;
      {user ? (
        <>
          <NavLink to={`/profile/${user.id}`}>Profile</NavLink>
          &nbsp;|&nbsp;
          <NavLink to="/posts">Posts</NavLink>
          &nbsp;|&nbsp;
          <NavLink to="/posts/new">New Post</NavLink>
          &nbsp;|&nbsp;
          <NavLink to="#" onClick={handleLogOut}>
            Logout
          </NavLink>
          &nbsp;|&nbsp;
          <span
            onClick={handleLogOut}
            className="NavBar-link"
            style={{ cursor: "pointer" }}
          >
            Log Out
          </span>
          &nbsp;|&nbsp;
          <span>Welcome, {user.name}</span>
        </>
      ) : (
        <>
          <NavLink to="/login">Log In</NavLink>
          &nbsp;|&nbsp;
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </nav>
  );
}