import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './SplashPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import AccountSetting from './AccountSetting';
import Menu from './Menu';
import Home from './Home'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account-setting" element={<AccountSetting />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/home" element={<Home />} />
       
      </Routes>
    </Router>
  );
}

export default App;
