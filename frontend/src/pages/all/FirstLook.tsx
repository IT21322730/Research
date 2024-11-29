import React from 'react';
import { IonButton, IonContent, IonHeader } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/FirstLook.css'; // Import the CSS file for styling

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
        <p className="welcome-look-text">
          <i>Welcome to </i><span className="ayurprakuthi-highlight">Ayur Prakruthi...!</span>
        </p>
        <div className="first-look-container">
          <img
            src="https://aadar.co/cdn/shop/articles/NEW-BLOG---2.png?v=1586645948"
            alt="Ayurvedic Image"
            className="first-look-image"
          />
          <p className="first-look-text">
            <i>An Ayurvedic approach to understand human for a healthy and better life</i>
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
