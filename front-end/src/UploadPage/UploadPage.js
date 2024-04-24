import React, { useState } from 'react';
import Header from '../Header/Header'; // Adjust the import path as necessary
import './UploadPage.css';
import axios from 'axios';

const UploadPage = () => {
    const [transcriptionResult, setTranscriptionResult] = useState('');

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        console.log('File uploaded:', file);
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3000/transcribe', formData);
            console.log('Transcription success:', response.data);
            // Update the transcription result state
            setTranscriptionResult(response.data.text || 'No transcription text received.');
        } catch (error) {
            console.error('Transcription error:', error);
            setTranscriptionResult('Error during transcription.');
        }
    };

    return (
        <div className="upload-page">
            <Header />
            <div className="upload-container">
                <h1>Upload</h1>
                <p>Some dummy text Some dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy text</p>
                <input type="file" id="fileInput" className="upload-input" hidden onChange={handleUpload} />
                <button className="upload-button" onClick={() => document.getElementById('fileInput').click()}>
                    Choose File
                </button>
                {/* Display the transcription result */}
                <div className="transcription-result">
                    <h2>Transcription Result:</h2>
                    <pre>{transcriptionResult}</pre>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
