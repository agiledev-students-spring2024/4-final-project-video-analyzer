import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header'; // Import the reusable Header component
import './LoginPage.css'; // Make sure this path is correct

import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      navigate('/home'); // Navigate to the home page if token exists
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password
      });

      // 登录成功，导航到主页
      if (response.status === 200) {
        localStorage.setItem('sessionToken', response.data.token);
        navigate('/home');
      }else {
        alert('Login failed, please try again later.'); // Handle other statuses
      }
    } catch (error) {
      // 处理错误，例如显示错误消息
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password');  // 简单错误处理
      } else {
        alert('Login failed, please try again later.');
      }
    }
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
