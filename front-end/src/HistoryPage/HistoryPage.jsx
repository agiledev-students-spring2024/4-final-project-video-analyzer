import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './HistoryPage.css';

const HistoryPage = () => {
  const navigate = useNavigate();

  const handleHistoryClick = (historyId) => {
    navigate(`/history/${historyId}`);
  };

  return (
    <div className="main-content">
        <Header />
        <div className="button-group">
            <h1>History</h1>
            <div className="history-list-container">
                <ul className="history-list">
                    <li onClick={() => handleHistoryClick(1)}>History_1</li>
                    <li onClick={() => handleHistoryClick(2)}>History_2</li>
                    <li onClick={() => handleHistoryClick(3)}>History_3</li>
                    <li onClick={() => handleHistoryClick(4)}>History_4</li>
                    {/* Add more history items as needed */}
                </ul>
            </div>
        </div>
    </div>
);

};

export default HistoryPage;