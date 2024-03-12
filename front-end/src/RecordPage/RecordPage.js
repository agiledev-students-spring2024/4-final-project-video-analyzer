import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header'; // Import the Header component
import './RecordPage.css';

const RecordPage = () => {
    const navigate = useNavigate();

    const handleVideoRecord = () => {
        console.log('Video record button clicked');
        // Implementation for video recording 
    };

    const handleAudioRecord = () => {
        console.log('Audio record button clicked');
        // Implementation for audio recording 
    };

    return (
        <div className="record-page">
            <Header /> {/* Use the Header component */}
            <main className="record-main">
                <div className="media-placeholder"></div>
                <button className="video-record-btn" onClick={handleVideoRecord}>
                    Video Record
                </button>
                <div className="or-divider">OR</div>
                <button className="audio-record-btn" onClick={handleAudioRecord}>
                    Audio Record
                </button>
            </main>
        </div>
    );
};

export default RecordPage;

