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
import "../css/FaceMappingPic.css";

const FacePic: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true); // Front camera initially
  const [showAlert, setShowAlert] = useState(false);
  const [currentView, setCurrentView] = useState<string>("Front View");
  const [capturedViews, setCapturedViews] = useState<{
    [view: string]: string;
  }>({}); // Stores the image for all views
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
  }, [useFrontCamera, currentView]); // Watch both useFrontCamera and currentView for changes

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

        // Save the captured image for the current view
        setCapturedViews((prev) => ({
          ...prev,
          [currentView]: dataUrl,
        }));
      }
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
  };

  const handleSaveToFirebase = async () => {
    try {
      const batch = collection(db, "facemicro");
      // Save all views (Front, Left, Right) that have been captured to Firebase
      for (const [view, imageUrl] of Object.entries(capturedViews)) {
        await addDoc(batch, { view, imageUrl, timestamp: new Date() });
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
    setCapturedViews({});
  };

  const handleSaveAlertResponse = (isSave: boolean) => {
    if (isSave) {
      // Save the captured images to Firebase
      handleSaveToFirebase();

      // After saving, reset the photo and switch views
      setPhoto(null);
      setCapturedViews({}); // Clear captured views

      if (currentView === "Front View") {
        setCurrentView("Left View");
        setUseFrontCamera(false); // Switch to rear camera for Left View
      } else if (currentView === "Left View") {
        setCurrentView("Right View");
        setUseFrontCamera(false); // Switch to rear camera for Right View
      } else if (currentView === "Right View") {
        setPhoto(null); // End the process after right view
        setCapturedViews({}); // Clear captured views
        setCurrentView("Front View"); // Reset back to front view after right view
        setUseFrontCamera(true); // Set the front camera on
      }
    } else {
      // If user clicked "No", just hide the alert and keep the current camera view
      setShowAlert(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/facemapping" />
          </IonButtons>
          <IonTitle>Take the Picture</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {!photo ? (
          <video
            key={currentView} // Add this line to force a re-render when switching views
            ref={videoRef}
            id="video"
            autoPlay
            playsInline
          ></video>
        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" />
        )}

        <IonSegment
          value={currentView}
          onIonChange={(e) => setCurrentView(e.detail.value as string)}
        >
          <IonSegmentButton value="Front View">
            <IonLabel style={{ fontFamily: '"Open Sans", sans-serif' }}>
              Front View
            </IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Left View">
            <IonLabel style={{ fontFamily: '"Open Sans", sans-serif' }}>
              Left View
            </IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Right View">
            <IonLabel style={{ fontFamily: '"Open Sans", sans-serif' }}>
              Right View
            </IonLabel>
          </IonSegmentButton>
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
          message={`Do you want to save the ${currentView.toLowerCase()} of your face?`}
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

export default FacePic;
