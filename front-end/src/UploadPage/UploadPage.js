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

        // Check if the file format is supported
        const supportedFormats = [
            "3ga",
            "webm",
            "8svx",
            "mts",
            "m2ts",
            "ts",
            "aac",
            "mov",
            "ac3",
            "mp2",
            "aif",
            "mp4",
            "m4p",
            "m4v",
            "aiff",
            "mxf",
            "alac",
            "amr",
            "ape",
            "au",
            "dss",
            "flac",
            "flv",
            "m4a",
            "m4b",
            "m4r",
            "mp3",
            "mpga",
            "ogg",
            "oga",
            "mogg",
            "opus",
            "qcp",
            "tta",
            "voc",
            "wav",
            "wma",
            "wv"
        ];
        
        const fileExtension = file.name.split('.').pop();
        console.log('File extension:', fileExtension);
        if (!supportedFormats.includes(fileExtension)) {
            alert('Unsupported file format.');
            return;
        }

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
        <div>
            <Header />
            <div className="main-content">
                <div className="button-group">
                    <h1>Upload</h1>
                    <p>Supported File Formats: .mp3, .wav, .mp4, .mov, .flv, .webm, ....</p>
                    <input type="file" id="fileInput" className="upload-input" hidden onChange={handleUpload} />
                    <button className="button" onClick={() => document.getElementById('fileInput').click()}>
                        Choose File
                    </button>
                </div>
                <div className="transcription-result">
                    <h2>Transcription Result:</h2>
                    <pre>{transcriptionResult}</pre>
                </div>
                <button className="button" onClick={() => window.history.back()}>
                        Back
                </button>
            </div>
        </div>
    );
    
};

export default UploadPage;
