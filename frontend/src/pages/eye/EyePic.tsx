import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonImg,
  IonButtons, IonBackButton, IonButton, IonAlert
} from '@ionic/react';
import { camera, save, swapHorizontal } from 'ionicons/icons';
import { db } from '../firebase/firebase';
import { addDoc, collection } from "firebase/firestore";
import '../css/EyePic.css';

const EyePic: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: useFrontCamera ? 'user' : 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(error => console.log('Video play was interrupted:', error));
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useFrontCamera]);

  const takePicture = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPhoto(dataUrl); // Set the captured image to display
      }
    }
  };
  


  const toggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
  };

  const handleSaveToFirebase = async () => {
    if (photo) {
      try {
        await addDoc(collection(db, "eye"), { imageUrl: photo, timestamp: new Date() });
        console.log("Image saved to Firebase");
        window.location.reload();
        
      } catch (error) {
        console.error("Error saving image to Firebase: ", error);
      }
    }
  };

  const confirmSaveOrDelete = () => {
    setShowAlert(true);
  };

  const handleAlertResponse = (confirmSave: boolean) => {
    setShowAlert(false);
    if (confirmSave) {
      handleSaveToFirebase();
    }
    setPhoto(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>Take Your Eye Picture</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!photo ? (
          <video ref={videoRef} id="video" autoPlay playsInline></video>
        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" />
        )}
        <div className="focus-text-container">
          <h2>Focus your eyes on the camera to capture a clear image.</h2>
        </div>

        <div className="tab-bar">
          <div className="tab-button" onClick={toggleCamera}>
            <IonIcon icon={swapHorizontal} />
          </div>
          <div className="tab-button" onClick={takePicture}>
            <IonIcon icon={camera} />
          </div>
          <div className="tab-button" onClick={confirmSaveOrDelete}>
            <IonIcon icon={save} />
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Save Image'}
          message={'Do you want to save this image?'}
          buttons={[
            {
              text: 'No',
              role: 'cancel',
              handler: () => handleAlertResponse(false)
            },
            {
              text: 'Yes',
              handler: () => handleAlertResponse(true)
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default EyePic;
