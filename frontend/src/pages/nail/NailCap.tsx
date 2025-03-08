import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonText, IonImg, IonBackButton, IonButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory
import '../css/NailPrakurthi.css'; // Import your styles here

const NailCap: React.FC = () => {
  const history = useHistory(); // Initialize useHistory

  const handleTakePicture = () => {
    console.log('Navigate to video recording page');
    history.push('/app/nail-video'); // Navigate to /app/eye-video
    window.location.reload()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>CAPILLARY REFILL TIME ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="eye-analysis-container">
          <IonText className="title-text">
            <h2 className='headline-name'>Capillary Refill Time Analysis</h2>
            <p className="justified-text">
              This analysis helps to determine your Ayurvedic dosha types based on nail characteristics. 
              Follow these simple instructions for accurate results.
            </p>
          </IonText>

          <IonImg 
            src="https://bjgp.org/content/bjgp/66/652/587/F1.large.jpg" 
            className="analysis-image" 
            alt="Eye Movement Analysis" 
          />

          <h3 className="instructions-heading">Instructions:</h3>
          <ol className="instructions-list" style={{ textAlign: 'justify', padding: '0 16px', margin: '0' }}>
          <li>Ensure good lighting and clean the camera lens.</li>
            <li>Place your hand flat on a neutral background, keep your fingers relaxed, and take a photo from directly above, ensuring your whole hand is visible.</li>
            <li>Hold your hand slightly clenched on a plain background with good lighting, and capture the top of your hand clearly showing the nails and fingertips.</li>
            <li>Hold the camera directly above your hand, ensuring the entire area, including nails and fingertips, is in focus.</li>
            <li>Gently press on the tip of one finger (e.g., the index finger) until the skin turns pale, then release the pressure and observe the time it takes for the normal color to return.</li>
            <li>Start recording a video or take multiple photos during the refill process, ensuring the camera is stable and your hand remains in the same position.</li>
          </ol>

          <button className="take-picture-button" onClick={handleTakePicture}>
            Start Video Recording
          </button>
        </div><br/>
      </IonContent>
    </IonPage>
  );
};

export default NailCap;