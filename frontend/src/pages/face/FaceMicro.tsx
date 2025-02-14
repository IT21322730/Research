import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonText, IonImg, IonBackButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/FaceMicro.css'; // Import your styles here

const FaceMicro: React.FC = () => {
  const history = useHistory();

  const handleTakePicture = () => {
    console.log('Open camera to take a picture');
    history.push('/app/face-video'); // Navigate to the desired page
    window.location.reload()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>FACE MICRO EXPRESSION ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="face-analysis-container">
          <IonText className="title-text">
            <h2 className='headline-name'>Face Micro Expression Analysis</h2>
            <p className="justified-text">
              This analysis helps to determine the Ayurvedic dosha types based on face characteristics. 
              Please follow the instructions for capturing your face images for accurate analysis.
            </p>
          </IonText>

          <IonImg src="https://www.candacesmithetiquette.com/images/xMontage_of_facial_expressions.jpg.pagespeed.ic.vB1xtSDp_0.jpg" className="analysis-image" />

          <h3 className="instructions-heading">Instructions:</h3>
          <ol className="instructions-list">
            <li>Ensure good lighting and clean the camera lens.</li>
            <li>Sit or stand comfortably, facing the camera.</li>
            <li>Look straight at the camera and maintain a neutral expression.</li>
            <li>Blink naturally and behave as you normally would in a casual setting.</li>
            <li>If comfortable, smile gently at some point during the recording.</li>
            <li>Avoid excessive movement. A slight natural sway is acceptable but keep your face mostly within the camera frame.</li>
          </ol>

          <button
          className="take-picture-button"
          style={{ backgroundColor: '#48D1CC', color: 'black' }}
          onClick={handleTakePicture}
          >
          Take Your Video
        </button>

        <br/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FaceMicro;
