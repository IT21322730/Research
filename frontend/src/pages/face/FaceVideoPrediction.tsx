import React from 'react';
import { useLocation } from 'react-router-dom';

// Define the type for the emotion data
interface EmotionData {
  emotion: string;
  count: number;
}

const FaceVideoPrediction: React.FC = () => {
  const location = useLocation<{ emotion: string; count: number }>(); // Specify the type of the location state

  // Destructure emotionData from location.state
  const emotionData = location.state || { emotion: 'No emotion', count: 0 };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Emotion Detection Result</h1>
      <p>Dominant Emotion: {emotionData.emotion}</p>
      <p>Emotion Count: {emotionData.count}</p>
    </div>
  );
};

export default FaceVideoPrediction;
