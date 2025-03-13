import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonText, IonImg, IonBackButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/Hairalophecia.css'; // Import your styles here

const HairAlophecia: React.FC = () => {
  const history = useHistory();

  const handleTakePicture = () => {
    console.log('Open camera to take a picture');
    history.push('/app/hair-pic-alophecia'); // Navigate to the desired page
    window.location.reload()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>PATERNED ALOPECIA ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="hair-analysis-container">
          <IonText className="title-text">
            <h2 className='headline-name'>Patterned Alopecia Analysis and Hair Texture Based Diagnosis</h2>
            <p className="justified-text">
              This analysis helps to determine the Ayurvedic dosha types based on hair characteristics. 
              Please follow the instructions for capturing your eye images for accurate analysis.
            </p>
          </IonText>

          <IonImg src="https://www.drmalaymehta.com/wp-content/uploads/2023/12/androgenic-alopecia-diagnosed-994x1024.jpg" className="analysis-image" />

          <h3 className="instructions-heading">Instructions:</h3>
          <ol className="instructions-list">
            <li>Ensure good lighting and clean the camera lens.</li>
            <li>Sit or stand comfortably, facing the camera.</li>
            <li>Front Weave: Face the camera directly, showing your hairline clearly.</li>
            <li>Back Weave: Turn around, ensuring the back of your head is visible.</li>
            <li>Scalp: Part your hair to expose the scalp and take close-ups.</li>
            <li>Top of Head: Capture a top-down view of your head, ensuring the crown area is clearly visible.</li>
            <li>Review the images for clarity before uploading.</li>
          </ol>
          <p style={{ color: "red", fontWeight: "bold", marginLeft: "20px", marginRight : "20px"}}>
            Remember:To get the optimal result, maintain the optimal lux value
          </p>

          <button
          style={{ 
            backgroundColor: '#48D1CC', 
            color: 'black',
            padding: "15px 20px", 
            borderRadius: "5px", 
            border: "none", 
            cursor: "pointer", 
            fontWeight: "bold", 
            width: "90%", 
            fontSize: "18px", /* Added font size */
            fontFamily: "'Open Sans', sans-serif" /* Added Font Style */ }}
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

export default HairAlophecia;
