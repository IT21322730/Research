import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonImg,
  IonButtons, IonBackButton, IonAlert, IonLoading
} from '@ionic/react';
import { camera, swapHorizontal, save, refreshCircle ,images } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase/firebase';  // Firebase Authentication
import { db, doc, getDoc } from '../firebase/firebase'; // Firestore for user data
import Reloader from '../all/Reloader';  // Reloader component for loading state
import LuxMeter from '../all/LuxMeter';  // LuxMeter component for measuring light
import '../css/EyePic.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const EyePic: React.FC = () => {
  const history = useHistory();
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [lux, setLux] = useState<number | null>(null);  // Store Lux value
  const videoRef = useRef<HTMLVideoElement>(null);

  const user = auth.currentUser; // Get current user from Firebase Auth
  const user_uid = user ? user.uid : ''; // Firebase Authentication UID

  // Function to get user document ID from Firestore
  const getUserDocId = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid); // Reference to user document
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
        console.log('Starting camera with facingMode:', useFrontCamera ? 'user' : 'environment');
  
        // Stop any existing camera stream
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
  
        // Start a new camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: useFrontCamera ? 'user' : 'environment' }
        });
  
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(error => console.log('Video play was interrupted:', error));
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };
  
    startCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useFrontCamera]);  // Re-run the camera setup whenever the camera toggle changes

  // Function to take a picture
  const takePicture = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      // Ensure the canvas matches the video dimensions
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally for front camera correction
        context.translate(videoWidth, 0);
        context.scale(-1, 1); // Mirror horizontally

        // Draw the flipped image
        context.drawImage(video, 0, 0, videoWidth, videoHeight);

        // Reset transformations (optional)
        context.setTransform(1, 0, 0, 1, 0, 0);

        // Convert to image and store
        const dataUrl = canvas.toDataURL('image/png');
        setPhoto(dataUrl);

        console.log('Captured Lux Value:', lux);
      }
    }
  };

  // Function to resize the image before sending it to the backend
  const resizeImage = (imageData: string, maxWidth: number = 1024, maxHeight: number = 1024) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.src = imageData;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        // Resize image while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a Base64 string
        const resizedImage = canvas.toDataURL('image/jpeg');
        resolve(resizedImage);
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Function to toggle between front and back camera
  const toggleCamera = () => {
    console.log("Toggling camera..."); // Log the camera toggle action
    setUseFrontCamera(prev => {
      const newUseFrontCamera = !prev;
      // Log the camera facing mode
      console.log("Switching to:", newUseFrontCamera ? 'front camera' : 'back camera');
      return newUseFrontCamera;
    });  // Toggle between front and back camera
  };
  
  // Function to save the image to backend
  const handleSaveToBackend = async () => {
    try {
      if (!photo) {
        console.error('No photo available to upload');
        return;
      }

      setLoading(true); // Show loader before saving

      // Resize the image before sending it to the backend
      const resizedPhoto = await resizeImage(photo);

      // Get user document ID from Firestore
      const user_doc_id = await getUserDocId(user_uid);
      if (!user_doc_id) {
        console.error('User document ID not found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://192.168.1.100:5000/process-firebase-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_data: resizedPhoto,  // Send resized photo
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

  const selectImageFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Photos, 
        resultType: CameraResultType.DataUrl,
      });

      if (image.dataUrl) {
        setPhoto(image.dataUrl); 
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  // Confirm before saving or deleting the image
  const confirmSaveOrDelete = () => {
    setShowAlert(true);
  };

  const handleAlertResponse = (confirmSave: boolean) => {
    setShowAlert(false);
    if (confirmSave) {
      handleSaveToBackend(); // Call the backend processing on save
    }
    setPhoto(null); // Reset the photo state
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>TAKE THE EYE PICTURE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ position: 'relative', top: '5px' }}>
          <LuxMeter onLuxChange={setLux} />
        </div>

        {/* Display camera feed or captured photo */}
        {!photo ? (
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '79vh', objectFit: 'cover' }} />
        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" style={{ width: '100%', height: '79vh' }} />
        )}

        {/* Camera controls */}
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
          <div className="tab-button" onClick={selectImageFromGallery}>
            <IonIcon icon={images} />
          </div>
          <div className="tab-button" onClick={confirmSaveOrDelete}>
            <IonIcon icon={save} />
          </div>
        </div>

        {/* Loading spinner */}
        {loading && <Reloader />}

        {/* Alert for saving or discarding the image */}
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
