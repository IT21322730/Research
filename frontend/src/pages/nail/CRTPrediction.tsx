import React from 'react';
import { useLocation } from 'react-router-dom';

const CRTPrediction = () => {
  // Retrieve the state passed from the previous page
  const location = useLocation();
  
  // Destructure the relevant fields from the location state
  const data = location.state as {
    circulatory_health?: string;
    crt_duration?: number;
    recommendation?: string;
    message?: string;
    vascular_efficiency?: string;
  };

  // If the data doesn't exist or it's missing fields, you can add fallback values or display a loading/error state.
  const { circulatory_health, crt_duration, recommendation, message, vascular_efficiency } = data || {};

  return (
    <div className="nail-prediction-container">
      <h1>Nail CRT Prediction Results</h1>
      <div className="result-item">
        <strong>Circulatory Health:</strong> {circulatory_health || 'N/A'}
      </div>
      <div className="result-item">
        <strong>CRT Duration:</strong> {crt_duration || 'N/A'} minutes
      </div>
      <div className="result-item">
        <strong>Vascular Efficiency:</strong> {vascular_efficiency || 'N/A'}
      </div>
      <div className="result-item">
        <strong>Recommendation:</strong> {recommendation || 'N/A'}
      </div>
      <div className="result-item">
        <strong>Message:</strong> {message || 'No message available'}
      </div>
    </div>
  );
};

export default CRTPrediction;
