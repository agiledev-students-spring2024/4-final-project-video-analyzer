import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Import the reusable Header component
import './Home.css';

const Home = () => {
  let navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Header />
      <div className="main-content">
        <div className="button-group">
          <button className="button" onClick={() => handleNavigation('/start-recording')}>Start Recording</button>
          <span className="or">or</span>
          <button className="button" onClick={() => handleNavigation('/upload-file')}>Upload File</button>
        </div>
        <button className="button" onClick={() => handleNavigation('/show-history')}>Show History</button>
      </div>
    </div>
  );
};

export default Home;
