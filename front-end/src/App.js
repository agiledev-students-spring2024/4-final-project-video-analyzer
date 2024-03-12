import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './SplashPage/SplashPage';
import LoginPage from './LoginPage/LoginPage';
import RegisterPage from './RegisterPage/RegisterPage';
import AccountSetting from './accountSettingPage/AccountSetting';
import Menu from './Menu/Menu';
import Home from './HomePage/HomePage'
import AboutUsPage from './AboutUsPage/AboutUsPage';
import HistoryPage from './HistoryPage/HistoryPage';
import RecordingDetails from './RecordDetailPage/RecordingDetails';
import RecordPage from './RecordPage/RecordPage';
import UploadPage from './UploadPage/UploadPage';



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
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:historyId" element={<RecordingDetails />} />
        <Route path="/start-recording" element={<RecordPage />} />
        <Route path="/upload-file" element={<UploadPage />} />


      </Routes>
    </Router>
  );
}

export default App;
