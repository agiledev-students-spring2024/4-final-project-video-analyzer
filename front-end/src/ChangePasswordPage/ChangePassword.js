import React, { useState } from 'react';
import axios from 'axios';
import './changePassword.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const response = await axios.post('/api/changePassword', {
        userId: localStorage.getItem('userId'), 
        currentPassword,
        newPassword,
      });

      setSuccess(true);
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {success && <p className="success-message">Password changed successfully!</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;