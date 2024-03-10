import React from 'react';
import Header from '../Header/Header'; // Import the reusable Header component
import { useNavigate } from 'react-router-dom';
import './AccountSetting.css'; // Ensure this path is correct

const AccountSetting = () => {
  const navigate = useNavigate();


  const handleChangePasswordClick = () => {
    //password change function here
    navigate('/change-password');
  };

  return (
    <div className="account-setting-container">
      <Header />
      <main className="account-setting-content">
        <h1>My Account</h1>
        <p className="account-email">123456@gmail.com</p>
        <button 
          className="change-password-button" 
          onClick={handleChangePasswordClick}>
          Change Password
        </button>
      </main>
    </div>
  );
};

export default AccountSetting;
