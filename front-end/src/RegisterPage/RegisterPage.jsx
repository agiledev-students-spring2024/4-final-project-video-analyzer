import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
import './RegisterPage.css'; 

import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password
      });

      // 注册成功后，导航到登录页面
      if (response.status === 201) {
        alert('Registration successful');
        navigate('/login');
      }
    } catch (error) {
      // 处理错误，显示错误消息
      if (error.response) {
        if (error.response.status === 409) {
          alert('Username already exists');
        } else {
          alert('Registration failed, please try again.');
        }
      } else {
        alert('Registration failed, please try again.');
      }
    }
  };

  return (
    <div className="register-container">
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
