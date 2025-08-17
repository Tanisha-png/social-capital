// import { useState } from 'react';
// import { useNavigate } from 'react-router';
// import * as authService from '../../services/authService';

// export default function SignUpPage({ setUser }) {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     mobile: '',
//     location: '',
//     password: '',
//     confirm: '',
//   });
//   const [errorMsg, setErrorMsg] = useState('');

//   const navigate = useNavigate();

//   function handleChange(evt) {
//     setFormData({ ...formData, [evt.target.name]: evt.target.value });
//     setErrorMsg('');
//   }

//   async function handleSubmit(evt) {
//     evt.preventDefault();
//     try {
//       const user = await authService.signUp(formData);
//       setUser(user);
//       navigate('/posts');
//     } catch (err) {
//       console.log(err);
//       setErrorMsg('Sign Up Failed - Try Again');
//     }
//   }

//   const disable = formData.password !== formData.confirm;

//   return (
//     <>
//       <h2>Sign Up!</h2>
//       <form autoComplete="off" onSubmit={handleSubmit}>
//         <label>First Name</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <label>Last Name</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <label>Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <label>Mobile</label>
//         <input
//           type="mobile"
//           name="mobile"
//           value={formData.mobile}
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
//         <label>Location</label>
//         <input
//           type="location"
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         />
//         <label>Confirm</label>
//         <input
//           type="password"
//           name="confirm"
//           value={formData.confirm}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" disabled={disable}>
//           SIGN UP
//         </button>
//       </form>
//       <p className="error-message">&nbsp;{errorMsg}</p>
//     </>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router";
import * as authService from "../../services/authService";
import "./SignUpPage.css"; // <-- We'll add styling here

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    location: "",
    password: "",
    confirm: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg("");
  }

  // async function handleSubmit(evt) {
  //   evt.preventDefault();
  //   try {
  //     const user = await authService.signUp(formData);
  //     setUser(user);
  //     navigate("/posts");
  //   } catch (err) {
  //     console.log(err);
  //     setErrorMsg("Sign Up Failed - Try Again");
  //   }
  // }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Combine firstName + lastName into one name field
      const submitData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      const user = await authService.signUp(submitData);
      setUser(user);
      navigate("/posts");
    } catch (err) {
      console.log(err);
      setErrorMsg("Sign Up Failed - Try Again");
    }
  }

  const disable = formData.password !== formData.confirm;

  return (
    <>
      <h2>Sign Up!</h2>
      <form autoComplete="off" onSubmit={handleSubmit} className="signup-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm</label>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={disable}>
          SIGN UP
        </button>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </>
  );
}

