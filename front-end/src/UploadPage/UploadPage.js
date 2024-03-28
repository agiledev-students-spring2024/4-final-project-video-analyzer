import React from 'react';
import Header from '../Header/Header'; // Adjust the import path as necessary
import './UploadPage.css';

const UploadPage = () => {
    const handleUpload = (event) => {
        // Implement what should happen when the file is uploaded
        const file = event.target.files[0];
        console.log('File uploaded:', file);
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        fetch('/transcribe', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Transcription success:', data);
        })
        .catch(error => {
            console.error('Transcription error:', error);
        });        
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
            </div>
        </div>
    );
};

export default UploadPage;
