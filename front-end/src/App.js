import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './SplashPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import AccountSetting from './AccountSetting';
import MenuPage from './MenuPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account-setting" element={<AccountSetting />} />
        <Route path="/menu" element={<MenuPage />} />
       
      </Routes>
    </Router>
  );
}

export default App;
