// import { useState } from 'react';
// import { useNavigate } from 'react-router';
// // import { useAuth } from "../../context/AuthContext";
// import * as authService from "../../services/authService";

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errorMsg, setErrorMsg] = useState('');
//   // const { setUser } = useAuth();
//   const navigate = useNavigate();

//   function handleChange(evt) {
//     setFormData({ ...formData, [evt.target.name]: evt.target.value });
//     setErrorMsg('');
//   }

//   // async function handleSubmit(evt) {
//   //   evt.preventDefault();
//   //   try {
//   //     const user = await authService.logIn(formData);
//   //     setUser(user);
//   //     navigate('/posts');
//   //   } catch (err) {
//   //     console.log(err);
//   //     setErrorMsg('Log In Failed - Try Again');
//   //   }
//   // }

//   async function handleSubmit(evt) {
//     evt.preventDefault();
//     try {
//       const { token, user } = await authService.logIn(formData);
//       // console.log("Submitting login", formData);

//       // Save to localStorage
//       // authService.saveAuthData(token, user);
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Update App state
//       setUser(user);

//       // Navigate to posts
//       navigate("/posts");
//     } catch (err) {
//       console.error(err);
//       setErrorMsg("Log In Failed - Try Again");
//     }
//   }

//   return (
//     <>
//       <h2>Log In!</h2>
//       <form autoComplete="off" onSubmit={handleSubmit}>
//         <label>Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <label>Password</label>
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Log In</button>
//         <button type="button">Forgot Password</button>
//       </form>
//       <p className="error-message">&nbsp;{errorMsg}</p>
//     </>
//   );
// }

// import React, { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import * as authService from "../../services/authService";
// import { useNavigate } from "react-router-dom";

// export default function LogInPage() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { user, token } = await authService.login(formData);
//       login(user, token);
//       navigate("/"); // stay on homepage after login
//     } catch (err) {
//       console.error(err);
//       alert("Login failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function LogInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await authService.login(formData);
      login(user, token);
      navigate("/"); // keep homepage
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <>
    <h2>Log In!</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
        <button type="submit">Forgot Password</button>
      </form>
    </>
  );
}
