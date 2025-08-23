import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';

export default function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }

  // async function handleSubmit(evt) {
  //   evt.preventDefault();
  //   try {
  //     const user = await authService.logIn(formData);
  //     setUser(user);
  //     navigate('/posts');
  //   } catch (err) {
  //     console.log(err);
  //     setErrorMsg('Log In Failed - Try Again');
  //   }
  // }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const { token, user } = await authService.logIn(formData);

      // Save to localStorage
      authService.saveAuthData(token, user);

      // Update App state
      setUser(user);

      // Navigate to posts
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setErrorMsg("Log In Failed - Try Again");
    }
  }

  return (
    <>
      <h2>Log In!</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
        <button type="button">Forgot Password</button>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </>
  );
}
