import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonText, IonImg, IonBackButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/EyePrakurthi.css'; // Import your styles here

const EyePrakurthi: React.FC = () => {
  const history = useHistory();

  const handleTakePicture = () => {
    console.log('Open camera to take a picture');
    history.push('/app/eye-pic'); // Navigate to the desired page
    window.location.reload()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/eyehome" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>PRAKRUTHI ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="eye-analysis-container">
          <IonText className="title-text">
            <h2 className='headline-name'>Eye Prakurthi Analysis</h2>
            <p className="justified-text">
              This analysis helps to determine the Ayurvedic dosha types based on eye characteristics. 
              Please follow the instructions for capturing your eye images for accurate analysis.
            </p>
          </IonText>

          <IonImg src="https://www.medicalindiatourism.com/wp-content/uploads/2021/11/eye-laser-surgery-banner-1024x597.jpg" className="analysis-image" />

          <h3 className="instructions-heading">Instructions:</h3>
          <ol className="instructions-list">
            <li>Ensure good lighting and clean the camera lens.</li>
            <li>Sit or stand comfortably, facing the camera.</li>
            <li>Focus on each eye separately, avoiding reflections and glare.</li>
            <li>Take close-up photos of the right eye and left eye.</li>
            <li>Review the images for clarity before uploading.</li>
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

export default EyePrakurthi;
