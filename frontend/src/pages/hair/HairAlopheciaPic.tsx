import React, { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonImg,
  IonButtons,
  IonBackButton,
  IonButton,
  IonAlert,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import { camera, save, swapHorizontal } from "ionicons/icons";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";


const HairPic: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true); // Front camera initially
  const [showAlert, setShowAlert] = useState(false);
  const [currentTab, setCurrentTab] = useState<number>(1); // Default to tab 1
  const [capturedPhotos, setCapturedPhotos] = useState<{ [tab: number]: string }>({}); // Store images for each tab
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: useFrontCamera ? "user" : "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((error) =>
            console.log("Video play was interrupted:", error)
          );
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useFrontCamera, currentTab]); // Watch both useFrontCamera and currentTab for changes

  const takePicture = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setPhoto(dataUrl);

        // Save the captured image for the current tab
        setCapturedPhotos((prev) => ({
          ...prev,
          [currentTab]: dataUrl,
        }));
      }
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
  };

  const handleSaveToFirebase = async () => {
    try {
      const batch = collection(db, "hairalophecia");
      // Save the captured images for all tabs to Firebase
      for (const [tab, imageUrl] of Object.entries(capturedPhotos)) {
        await addDoc(batch, { tab, imageUrl, timestamp: new Date() });
      }
      console.log("Images saved to Firebase");
    } catch (error) {
      console.error("Error saving images to Firebase: ", error);
    }
  };

  const confirmSave = () => {
    setShowAlert(true);
  };

  const resetPhotos = () => {
    setPhoto(null);
    setCapturedPhotos({});
  };

  const handleSaveAlertResponse = (isSave: boolean) => {
    if (isSave) {
      // Save the captured images to Firebase
      handleSaveToFirebase();

      // After saving, reset the photo and switch to the next tab
      setPhoto(null);
      setCapturedPhotos({}); // Clear captured images

      if (currentTab === 3) {
        setCurrentTab(1); // Reset to tab 1 after tab 5
        setUseFrontCamera(true); // Switch to front camera
      } else {
        setCurrentTab((prev) => prev + 1); // Switch to the next tab
      }
    } else {
      // If user clicked "No", just hide the alert and keep the current tab
      setShowAlert(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/alophecia" />
          </IonButtons>
          <IonTitle>Take the Picture</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {!photo ? (
          <video
            key={currentTab} // Force re-render when switching tabs
            ref={videoRef}
            id="video"
            autoPlay
            playsInline
          ></video>
        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" />
        )}

        <IonSegment
          value={String(currentTab)} // Set the segment to current tab
          onIonChange={(e) => setCurrentTab(Number(e.detail.value))}
        >
          {[1, 2, 3].map((tabNumber) => (
            <IonSegmentButton key={tabNumber} value={String(tabNumber)}>
              <IonLabel style={{ fontFamily: '"Open Sans", sans-serif' }}>
                {tabNumber}
              </IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        <div className="tab-bar">
          <div className="tab-button" onClick={toggleCamera}>
            <IonIcon icon={swapHorizontal} />
          </div>
          <div className="tab-button" onClick={takePicture}>
            <IonIcon icon={camera} />
          </div>
          <div className="tab-button" onClick={confirmSave}>
            <IonIcon icon={save} />
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Save Image"}
          message={`Do you want to save the picture for tab ${currentTab}?`}
          buttons={[
            {
              text: "No",
              role: "cancel",
              handler: () => handleSaveAlertResponse(false),
            },
            {
              text: "Yes",
              handler: () => handleSaveAlertResponse(true),
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default HairPic;
