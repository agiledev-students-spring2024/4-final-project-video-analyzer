import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  let navigate = useNavigate();

  return (
    <header className="app-header">
      <button className="menu-button" onClick={() => navigate('/menu')}>☰</button>
      <img src="path-to-your-logo.png" alt="logo" className="logo" />
      <img src="path-to-your-account-icon.png" alt="account icon" className="account-icon" />
    </header>
  );
};

export default Header;
