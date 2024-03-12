import React from 'react';
import Header from '../Header/Header'; // Adjust the import path as necessary
import './UploadPage.css';

const UploadPage = () => {
    const handleUpload = (event) => {
        // Implement what should happen when the file is uploaded
        console.log('File uploaded:', event.target.files[0]);
    };

    return (
        <div className="upload-page">
            <Header />
            <div className="upload-container">
                <h1>Upload</h1>
                <p>Some dummy text Some dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy textSome dummy text</p>
                <input type="file" id="fileInput" className="upload-input" hidden onChange={handleUpload} />
                <label htmlFor="fileInput" className="upload-button">Choose File</label>
                <button className="upload-button" onClick={() => document.getElementById('fileInput').click()}>
                    Upload
                </button>
            </div>
        </div>
    );
};

export default UploadPage;
