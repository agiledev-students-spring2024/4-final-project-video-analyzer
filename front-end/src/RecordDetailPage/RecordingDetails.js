// React component for the Recording Details page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header'; // Make sure the Header component is correctly imported
import './RecordingDetails.css'; // The CSS file for styling this component

const RecordingDetails = () => {
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Takes the user back to the previous page
  };

  return (
    <div className="container">
      <Header />
      <div className="content">
        <h1>Recording Details</h1>
        <div className="details">
          <p className="result">
            result: Some dummy text Some dummy text Some dummy text Some dummy text
            Some dummy text Some dummy text Some dummy text Some dummy text
            Some dummy text Some dummy text Some dummy text Some dummy text
            Some dummy text Some dummy text
          </p>
        </div>
        <button className="back-button" onClick={goBack}>Back</button>
      </div>
    </div>
  );
};

export default RecordingDetails;
