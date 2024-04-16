import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  let navigate = useNavigate();

  return (
    <header className="app-header">
      <button className="menu-button" onClick={() => navigate('/menu')}>
        {/* Insert hamburger icon here */}
        ☰
      </button>
      <div className="logo">
        {/* Insert logo here */}
        <img src="path-to-your-logo.png" alt="logo" />
      </div>
      <div className="account-icon" onClick={() => navigate('/account')}>
        {/* Insert account icon here */}
        <img src="path-to-your-account-icon.png" alt="account icon" />
      </div>
    </header>
  );
};

export default Header;
