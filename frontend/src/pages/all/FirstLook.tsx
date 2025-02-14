import React, { useEffect } from 'react';
import { IonContent, IonHeader } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/FirstLook.css'; // Import the CSS file for styling
import localImage from '../images/img_03.png'; // Import the local image

const FirstLook: React.FC = () => {
  const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    // Automatically navigate to /login after the component mounts
    const timer = setTimeout(() => {
      history.push('/login');
    }, 3000); // Redirect after 3 seconds (adjust as needed)

    return () => clearTimeout(timer); // Cleanup the timer
  }, [history]); // Dependencies for useEffect

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
          {/* No button needed */}
        </div>
      </IonContent>
    </>
  );
};

export default FirstLook;
