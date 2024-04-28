import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; 
import accountIcon from "../assets/account-icon.png";
import homeIcon from "../assets/home-icon.png";

const Header = () => {
  let navigate = useNavigate();

  return (
    <header className="app-header">
      <button className="menu-button" onClick={() => navigate('/menu')}>
        {/* Insert hamburger icon here */}
        ☰
      </button>
      <div className="logo" onClick={() => navigate('/home')}>
        {/* Insert logo here */}
        <img src={homeIcon} alt="logo" />
      </div>
      <div className="account-icon" onClick={() => navigate('/account-setting')}>
        {/* Insert account icon here */}
        <img src={accountIcon} alt="account icon" />
      </div>
    </header>
  );
};

export default Header;
