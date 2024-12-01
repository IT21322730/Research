import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonText, IonImg, IonBackButton, IonButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory
import '../css/Eye.css'; // Import your styles here

const BlinkEye: React.FC = () => {
  const history = useHistory(); // Initialize useHistory

  const handleTakePicture = () => {
    console.log('Navigate to video recording page');
    history.push('/app/eye-video'); // Navigate to /app/eye-video
    window.location.reload()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/eyehome" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>BLINKING RATE AND EYE MOVEMENT ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="eye-analysis-container">
          <IonText className="title-text">
            <h2 className='headline-name'>Blink Rate & Eye Movement Analysis</h2>
            <p className="justified-text">
              This analysis helps to determine your Ayurvedic dosha types based on eye characteristics. 
              Follow these simple instructions for accurate results.
            </p>
          </IonText>

          <IonImg 
            src="https://www.sistemaimpulsa.com/blog/wp-content/uploads/2024/05/Beneficios-del-Eye-Tracking-para-tu-estrategia-de-marketing.jpg" 
            className="analysis-image" 
            alt="Eye Movement Analysis" 
          />

          <h3 className="instructions-heading">Instructions:</h3>
          <ol className="instructions-list" style={{ textAlign: 'justify', padding: '0 16px', margin: '0' }}>
            <li>Ensure your environment is well-lit and the camera lens is clean.</li>
            <li>Position yourself comfortably, facing the camera at eye level.</li>
            <li>Keep your head still and focus your gaze on the camera.</li>
            <li>Blink naturally while recording for at least 30 seconds to measure your blink rate.</li>
            <li>For eye movement, slowly follow a finger or object horizontally and vertically as directed.</li>
            <li>After recording, review the footage to ensure the images are clear for analysis.</li>
          </ol>

          <button className="take-picture-button" onClick={handleTakePicture}>
            Start Video Recording
          </button>
        </div><br/>
      </IonContent>
    </IonPage>
  );
};

export default BlinkEye;
