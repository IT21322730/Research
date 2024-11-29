import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; 
import { IonPage, IonContent,IonIcon, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, IonButton } from "@ionic/react";
import '../css/Step.css';  // Importing the CSS file

const Step: React.FC = () => {

    const history = useHistory();

    const handleTakeFacePicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/eye-pic'); // Navigate to the desired page
        window.location.reload();
    };
    const handleTakeEyePicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/eye-pic'); // Navigate to the desired page
        window.location.reload();
    };
    const handleTakeHairPicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/hair-pic'); // Navigate to the desired page
        window.location.reload();
    };
    const handleTakeNailPicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/nail-pic'); // Navigate to the desired page
        window.location.reload();
    };

    const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);

        useEffect(() => {
            if (!accordionGroup.current) {
            return;
            }

            accordionGroup.current.value = ['first', 'fourth'];
        }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" /> 
          </IonButtons>
          <IonTitle>Prakurthi Analysis</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonAccordionGroup>

          {/* First Accordion: Face Prakurthi Analysis */}
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              Step 01
            </IonItem>
            <div className="ion-padding" slot="content">
              <h2 className='headline-name'>Face Prakurthi Analysis</h2>
              <p className="justified-text">
                This analysis helps to determine the Ayurvedic dosha types based on face characteristics. Please follow the instructions for capturing your face images for accurate analysis.
              </p>
              <h3 className="instructions-heading">Instructions:</h3>
              <ul>
                <li>Ensure good lighting and clean the camera lens.</li>
                <li>Sit or stand comfortably, facing the camera.</li>
                <li>Front View: Look straight into the camera and keep your face neutral and relaxed.</li>
                <li>Left Side View: Turn your head slightly to the left, ensuring your profile is fully visible. Keep your eyes straight and relaxed.</li>
                <li>Right Side View: Turn your head slightly to the right, ensuring your profile is fully visible. Keep your posture consistent.</li>
                <li>Review the images for clarity before uploading.</li>
              </ul>
              <button
                className="take-picture-button"
                style={{ backgroundColor: '#48D1CC', color: 'black' }}
                onClick={handleTakeFacePicture}
              >
                Take Your Picture
              </button>
            </div>
          </IonAccordion>

          {/* Second Accordion */}
          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              Step 02
            </IonItem>
            <div className="ion-padding" slot="content">
              <h2 className='headline-name'>Eye Prakurthi Analysis</h2>
              <p className="justified-text">
                This analysis helps to determine the Ayurvedic dosha types based on eye characteristics. 
                Please follow the instructions for capturing your eye images for accurate analysis.
              </p>
              <h3 className="instructions-heading">Instructions:</h3>
              <ul className="instructions-list">
                <li>Ensure good lighting and clean the camera lens.</li>
                <li>Sit or stand comfortably, facing the camera.</li>
                <li>Focus on each eye separately, avoiding reflections and glare.</li>
                <li>Take close-up photos of the right eye and left eye.</li>
                <li>Review the images for clarity before uploading.</li>
              </ul>
              <button
                className="take-picture-button"
                style={{ backgroundColor: '#48D1CC', color: 'black' }}
                onClick={handleTakeEyePicture}
              >
                Take Your Picture
              </button>
            </div>
          </IonAccordion>

          <IonAccordion value="third">
            <IonItem slot="header" color="light">
              Step 03
            </IonItem>
            <div className="ion-padding" slot="content">
              <h2 className='headline-name'>Hair Prakurthi Analysis</h2>
              <p className="justified-text">
                This analysis helps to determine the Ayurvedic dosha types based on eye characteristics. 
                Please follow the instructions for capturing your hair images for accurate analysis.
              </p>
              <h3 className="instructions-heading">Instructions:</h3>
              <ul className="instructions-list">
              <li>Ensure good lighting and clean the camera lens.</li>
            <li>Sit or stand comfortably, facing the camera.</li>
            <li>Front Weave: Face the camera directly, showing your hairline clearly.</li>
            <li>Back Weave: Turn around, ensuring the back of your head is visible.</li>
            <li>Scalp: Part your hair to expose the scalp and take close-ups.</li>
            <li>Review the images for clarity before uploading.</li>
              </ul>
              <button
                className="take-picture-button"
                style={{ backgroundColor: '#48D1CC', color: 'black' }}
                onClick={handleTakeHairPicture}
              >
                Take Your Picture
              </button>
            </div>
          </IonAccordion>

          <IonAccordion value="fourth">
            <IonItem slot="header" color="light">
              Step 04
            </IonItem>
            <div className="ion-padding" slot="content">
              <h2 className='headline-name'>Eye Prakurthi Analysis</h2>
              <p className="justified-text">
                This analysis helps to determine the Ayurvedic dosha types based on eye characteristics. 
                Please follow the instructions for capturing your eye images for accurate analysis.
              </p>
              <h3 className="instructions-heading">Instructions:</h3>
              <ul className="instructions-list">
              <li>Ensure good lighting and clean the camera lens.</li>
            <li>Place your hand flat on a neutral background, keep your fingers relaxed, and take a photo from directly above, ensuring your whole hand is visible.</li>
            <li>Hold your hand slightly clenched on a plain background with good lighting, and capture the top of your hand clearly showing the nails and fingertips.</li>
              </ul>
              <button
                className="take-picture-button"
                style={{ backgroundColor: '#48D1CC', color: 'black' }}
                onClick={handleTakeNailPicture}
              >
                Take Your Picture
              </button>
            </div>
          </IonAccordion>

          <IonAccordion value="fifth">
            <IonItem slot="header" color="light">
                 Step 05
            </IonItem>
            <div className="ion-padding" slot="content">
            <p className="justified-text">You need to complete the above steps as mentioned.</p>

            <button
                className="take-picture-button"
                style={{ backgroundColor: '#48D1CC', color: 'black' }}
                onClick={handleTakeNailPicture}
              >
                Final
              </button>
            </div>
          </IonAccordion>



        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Step;
