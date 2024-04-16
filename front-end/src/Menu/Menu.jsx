import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css'; 

const MenuPage = () => {
  let navigate = useNavigate();

  return (
    <div className="menu-page">
      <button className="close-menu" onClick={() => navigate(-1)}>×</button>
      <ul className="menu-list">
        <li onClick={() => navigate('/home')}>Home</li>
        <li onClick={() => navigate('/account-setting')}>Account Setting</li>
        <li onClick={() => navigate('/about')}>About Us</li>
      </ul>
    </div>
  );
};

export default MenuPage;


