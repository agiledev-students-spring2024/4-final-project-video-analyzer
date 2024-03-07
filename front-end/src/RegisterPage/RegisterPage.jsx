import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Make sure the Header component is in the same directory
import './RegisterPage.css'; // Ensure this path is correct

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (event) => {
    event.preventDefault();
    // Implement your register logic here

    // After registration, navigate to the login page or home page
    navigate('/login');
  };

  return (
    <div className="register-container">
      <Header />
      <main className="register-content">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="register-input"
            placeholder="enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="register-input"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">Register</button>
        </form>
        <div className="alternative-option">
          or,
          <span className="login-link" onClick={() => navigate('/login')}> log in</span>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
