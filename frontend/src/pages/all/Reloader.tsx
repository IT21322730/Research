import React from 'react';
import { IonSpinner } from '@ionic/react';
import '../css/Reloader.css'; // Import the CSS file

const Reloader: React.FC = () => {
  return (
    <div className="overlay">
      <div className="container">
        <IonSpinner name="crescent" />
        <p className="message">Processing your image, please wait...</p>
      </div>
    </div>
  );
};

export default Reloader;