import React from 'react';
import Header from './Header'; // Import the reusable Header component
import './SplashPage.css'; // Ensure this path is correct

const SplashPage = () => {
  return (
    <div className="splash-container">
      <Header />
      <main className="splash-content">
        <h1>Video Transcriber</h1>
        <p>Some dummy text Some dummy textSome dummy textSome dummy textSome dummy text</p>
        <button className="login-button">Log In</button>
      </main>
    </div>
  );
};

export default SplashPage;




