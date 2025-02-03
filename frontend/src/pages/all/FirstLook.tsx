import React from 'react';
import { IonButton, IonContent, IonHeader } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/FirstLook.css'; // Import the CSS file for styling
import localImage from '../images/img_03.png'; // Import the local image

const FirstLook: React.FC = () => {
  const history = useHistory(); // Initialize useHistory

  const handleStartClick = () => {
    history.push('/login'); // Navigate to the /login page
  };

  return (
    <>
      <IonHeader>
        {/* Optional: Add title or navigation if needed */}
      </IonHeader>

      <IonContent 
      className="first-look-content"
      >
        <div className="first-look-container">
          <img
            src={localImage} // Use the imported local image here
            alt="Ayurvedic Image"
            className="first-look-image"
          />
          <p className="first-look-text">
            {/* Add text here if needed */}
          </p>
          <div className="button-container">
            <button className="take-picture-button" onClick={handleStartClick}>
              Let&apos;s Start
            </button>
          </div>
        </div>
      </IonContent>
    </>
  );
};

export default FirstLook;
