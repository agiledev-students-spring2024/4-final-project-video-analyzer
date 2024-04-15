import React, { useState, useEffect }from 'react';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import './AccountSetting.css';
import axios from 'axios';

const AccountSetting = () => {
  const navigate = useNavigate();


  const handleChangePasswordClick = () => {
    //password change function here
    navigate('/change-password');
  };

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const authToken = localStorage.getItem('sessionToken');
        console.log('Auth token:', authToken);
        if (!authToken) {
          console.error('No auth token available.');
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:3000/user-info', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setUserInfo(response.data);
        //localStorage.setItem('sessionToken', response.data.sessionToken);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="account-setting-container">
      <Header />
      <main className="account-setting-content">
        <h1>My Account</h1>
        <p className="account-email">{userInfo.username}</p>
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
