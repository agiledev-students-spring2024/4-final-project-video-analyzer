import React from 'react';
import Header from '../Header/Header'; // Import the reusable Header component
import { useNavigate } from 'react-router-dom';
import './SplashPage.css'; // Ensure this path is correct

const SplashPage = () => {
  let navigate = useNavigate();

  return (
    <div className="splash-container">
      <Header />
      <main className="splash-content">
        <h1>Video Transcriber</h1>
        <p>Some dummy text Some dummy textSome dummy textSome dummy textSome dummy text</p>
        <button className="login-button" onClick={() => navigate('/login')}>Log In</button>
      </main>
    </div>
  );
};

export default SplashPage;




