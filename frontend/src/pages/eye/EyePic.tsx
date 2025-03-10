 import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonImg,
  IonButtons, IonBackButton, IonAlert, IonLoading
} from '@ionic/react';
import { camera, swapHorizontal, save,refreshCircle } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/firebase";  // Use auth instead of getAuth
import { db, doc, getDoc } from "../firebase/firebase"; // Use db instead of getFirestore, getDocs instead of getDoc
import Reloader from '../all/Reloader'; // Import Reloader component
import '../css/EyePic.css';

const EyePic: React.FC = () => {
  const history = useHistory();
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // Loader state
  const videoRef = useRef<HTMLVideoElement>(null);

  const user = auth.currentUser; // Get current user from Firebase Auth
  const user_uid = user ? user.uid : ''; // Firebase Authentication UID

  // Function to get user document ID from Firestore
   // Function to get user document ID from Firestore
   const getUserDocId = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid); // Reference to user document
      const userDoc = await getDoc(userRef);  // Use getDoc to fetch a single document
  
      if (userDoc.exists()) {
        return userDoc.id;  // Accessing the document's ID
      } else {
        console.error('User not found in Firestore');
        return '';
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      return '';
    }
  };

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
      const canvas = document.createElement("canvas");
  
      // Ensure the canvas matches the video dimensions
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
  
      const context = canvas.getContext("2d");
      if (context) {
        // Flip the image horizontally for front camera correction
        context.translate(videoWidth, 0);
        context.scale(-1, 1); // Mirror horizontally
  
        // Draw the flipped image
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
  
        // Reset transformations (optional, but good practice)
        context.setTransform(1, 0, 0, 1, 0, 0);
  
        // Convert to image and store
        const dataUrl = canvas.toDataURL("image/png");
        setPhoto(dataUrl);
      }
    }
  };
  

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };
  

  const handleSaveToBackend = async () => {
    try {
      if (!photo) {
        console.error('No photo available to upload');
        return;
      }
  
      setLoading(true); // Show loader before saving

      // Get user document ID from Firestore
      const user_doc_id = await getUserDocId(user_uid);
      if (!user_doc_id) {
        console.error('User document ID not found');
        setLoading(false);
        return;
      }
  
      const response = await fetch('http://127.0.0.1:5000/process-firebase-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image_data: photo,
          user_uid: user_uid,
          user_doc_id: user_doc_id // Send both UID and document ID
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error uploading image:', errorMessage);
        setLoading(false); // Hide loader on error
        return;
      }
  
      const result = await response.json();
      
      // Check if document_id exists in the response
      if (result.document_id) {
        console.log('Image processed successfully:', result.message);
        console.log('Prediction:', result.prediction);
  
        // Redirect to the prediction page with the docId
        history.push(`/app/prediction/${result.document_id}`);
      } else {
        console.error('No docId returned from the backend');
        setLoading(false); // Hide loader on error
      }
    } catch (error) {
      console.error('Request failed:', error);
      setLoading(false); // Hide loader on error
    }
  };
  
  const confirmSaveOrDelete = () => {
    setShowAlert(true);
  };

  const handleAlertResponse = (confirmSave: boolean) => {
    setShowAlert(false);
    if (confirmSave) {
      handleSaveToBackend(); // Call the backend processing on save
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
          <IonTitle>TAKE THE PICTUER</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!photo ? (

          <video ref={videoRef} id="video" autoPlay playsInline style={{ width: '100%', height: '79vh', objectFit: 'cover' }}></video>

        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" style={{ width: '100%', height: '79vh'}} />
        )}

        <div className="tab-bar">
        <div className="tab-button" onClick={() => window.location.reload()}>
            <IonIcon icon={refreshCircle} />
          </div>
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

        {loading && <Reloader />} {/* Display Reloader when loading */}

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