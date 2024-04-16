import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import './ChangePW.css';

const ChangePasswordForm = () => {
  const [inputs, setInputs] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setInputs({...inputs, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.newPassword !== inputs.confirmNewPassword) {
        setMessage('New passwords do not match.');
        return;
    }

    try {
        const authToken = localStorage.getItem('sessionToken');
        const response = await axios.post('http://localhost:3000/change-password', {
            oldPassword: inputs.oldPassword,
            newPassword: inputs.newPassword
        }, {
            headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        setMessage('Password successfully changed.');
    } catch (error) {
        setMessage(error.response.data.message || 'Failed to change password.');
    }
  };

  return (
    <div>
    <Header />
    <form onSubmit={handleSubmit}>
        
      <label>
        Old Password:
        <input type="password" name="oldPassword" value={inputs.oldPassword} onChange={handleChange} required />
      </label>
      <label>
        New Password:
        <input type="password" name="newPassword" value={inputs.newPassword} onChange={handleChange} required />
      </label>
      <label>
        Confirm New Password:
        <input type="password" name="confirmNewPassword" value={inputs.confirmNewPassword} onChange={handleChange} required />
      </label>
      <button type="submit">Change Password</button>
      {message && <p>{message}</p>}
    </form>
    </div>
  );
};

export default ChangePasswordForm;
