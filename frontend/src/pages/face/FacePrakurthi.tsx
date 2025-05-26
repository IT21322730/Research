import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonText, IonImg, IonBackButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/FacePrakurthi.css'; // Import your styles here

const FacePrakurthi: React.FC = () => {
  const history = useHistory();

  const handleTakePicture = () => {
    console.log('Open camera to take a picture');
    history.push('/app/face-pic'); // Navigate to the desired page
    window.location.reload()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/facehome" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>PRAKRUTHI ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="face-analysis-container">
          <IonText className="title-text">
            <h2 className='headline-name'>Face Prakurthi Analysis</h2>
            <p className="justified-text">
              This analysis helps to determine the Ayurvedic dosha types based on face characteristics. 
              Please follow the instructions for capturing your face images for accurate analysis.
            </p>
          </IonText>

          <IonImg src="https://ayuvi.com/wp-content/uploads/2020/09/UNDERSTANDING-YOUR-PRAKRUTI-AND-VIKRUTI.jpg" className="analysis-image" />

          <h3 className="instructions-heading">Instructions:</h3>
          <ol className="instructions-list">
            <li>Ensure good lighting and clean the camera lens.</li>
            <li>Sit or stand comfortably, facing the camera.</li>
            <li>Front View:Look straight into the camera and Keep your face neutral and relaxed.</li>
            <li>Left Side View:Turn your head slightly to the left, ensuring your profile is fully visible.Keep your eyes straight and relaxed.</li>
            <li>Right Side View:Turn your head slightly to the right, ensuring your profile is fully visible.Keep your posture consistent.</li>
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

export default FacePrakurthi;
