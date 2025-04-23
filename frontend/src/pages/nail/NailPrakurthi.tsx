import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonText, IonImg, IonBackButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/NailPrakrurthi.css';
const NailPrakurthi: React.FC = () => {
  const history = useHistory();

  const handleTakePicture = () => {
    console.log('Open camera to take a picture');
    history.push('/app/nail-pic'); // Navigate to the desired page
    window.location.reload()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/nailhome" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>PRAKRUTHI ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="nail-analysis-container">
          <IonText className="title-text">
            <h2 className='headline-name'>Nail Prakurthi Analysis</h2>
            <p className="justified-text">
              This analysis helps to determine the Ayurvedic dosha types based on nail characteristics. 
              Please follow the instructions for capturing your eye images for accurate analysis.
            </p>
          </IonText>

          <IonImg src="https://nailknowledge.org/wp-content/uploads/2020/12/Natural-nails-1.jpg" className="analysis-image" />

          <h3 className="instructions-heading">Instructions:</h3>
          <ol className="instructions-list">
            <li>Ensure good lighting and clean the camera lens.</li>
            <li>Place your hand flat on a neutral background, keep your fingers relaxed, and take a photo from directly above, ensuring your whole hand is visible.</li>
            <li>Hold your hand slightly clenched on a plain background with good lighting, and capture the top of your hand clearly showing the nails and fingertips.</li>
          </ol>

          <button
          className="take-picture-button"
          style={{ backgroundColor: '#48D1CC', color: 'black' }}
          onClick={handleTakePicture}
          >
          Take Your Picture
        </button>

        <br/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NailPrakurthi;
