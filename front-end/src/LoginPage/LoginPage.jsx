import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header'; // Import the reusable Header component
import './LoginPage.css'; // Make sure this path is correct

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // add the login funciton here
    navigate('/home');
  };

  return (
    <div className="login-container">
      <Header />
      <main className="login-content">
        <h1>login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Log In</button>
        </form>
        <div className="alternative-option">
          or,
          <span className="register-link" onClick={() => navigate('/register')}> register as new</span>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
