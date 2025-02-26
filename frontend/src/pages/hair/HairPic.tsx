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
import { camera, save, swapHorizontal, warning } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
 


const HairPic: React.FC = () => {
  const history = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [capturedViews, setCapturedViews] = useState<{ [view: string]: string }>({});
  const [currentView, setCurrentView] = useState<string>("Front View");
  const [missingViews, setMissingViews] = useState<string[]>(["Front View", "Back View", "Scalp View"]);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);

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
  }, [useFrontCamera, currentView]);

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

        setCapturedViews((prev) => {
          const updatedViews = { ...prev, [currentView]: dataUrl };
          validateCapturedViews(updatedViews);
          return updatedViews;
        });
      }
    }
  };

  const validateCapturedViews = (views: { [view: string]: string }) => {
    const requiredViews = ["Front View", "Back View", "Scalp View"];
    const missing = requiredViews.filter((view) => !views[view]);
    setMissingViews(missing);
  };
 
  const handleSaveToBackend = async () => {
    const auth = getAuth(); // Get Firebase Auth instance
    const user = auth.currentUser; // Get the currently logged-in user

    if (!user) {
      console.error("No authenticated user found. Please log in.");
      return;
    }

    const capturedImages = Object.values(capturedViews);

    if (capturedImages.length !== 3) {
      console.error("You must provide exactly 3 images.");
      return;
    }

    const requestData = {
      user_uid: user.uid, // Automatically retrieve the UID of the logged-in doctor
      patient_uid: "patient456", // Keep or update as needed
      image_data: capturedImages.map(img => img.split(",")[1]) // Remove metadata prefix
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/process-hair-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response from server:", data);

      // Navigate to PredictionPage with the prakruti result
      history.push({
        pathname: "/app/hair-results",
        state: { prakrutiResult: data }
      });

    } catch (error) {
      console.error("Error uploading images:", error);
    }
};


  const resetPhotos = () => {
    setPhoto(null);
    setCapturedViews({});
    setMissingViews(["Front View", "Back View", "Scalp View"]);
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
      <IonContent>
        {!photo ? (
          <video ref={videoRef} id="video" autoPlay playsInline></video>
        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" />
        )}

        <IonSegment
          value={currentView}
          onIonChange={(e) => {
            setCurrentView(e.detail.value as string);
            setPhoto(null);
          }}
        >
          <IonSegmentButton value="Front View">
            <IonLabel>Front View</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Back View">
            <IonLabel>Back View</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Scalp View">
            <IonLabel>Scalp View</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <div className="tab-bar">
          <div className="tab-button" onClick={() => setUseFrontCamera(!useFrontCamera)}>
            <IonIcon icon={swapHorizontal} />
          </div>
          <div className="tab-button" onClick={takePicture}>
            <IonIcon icon={camera} />
          </div>
          <div className="tab-button">
            <IonButton onClick={() => setShowSaveAlert(true)} disabled={missingViews.length > 0}>
              <IonIcon icon={save} />
            </IonButton>
          </div>
        </div>

        {missingViews.length > 0 && (
          <p className="missing-warning">
            <IonIcon icon={warning} /> Please capture: {missingViews.join(", ")}
          </p>
        )}

        <IonAlert
          isOpen={showSaveAlert}
          onDidDismiss={() => setShowSaveAlert(false)}
          header={"Save Images"}
          message={"Are you sure you want to save the captured images?"}
          buttons={[
            {
              text: "No",
              role: "cancel",
              handler: () => setShowSaveAlert(false),
            },
            {
              text: "Yes",
              handler: handleSaveToBackend,
            },
          ]}
        />

        <IonAlert
          isOpen={showSaveAlert}
          onDidDismiss={() => setShowSaveAlert(false)}
          header={"Save Images"}
          message={"Are you sure you want to save the captured images?"}
          buttons={[
            {
              text: "No",
              role: "cancel",
              handler: () => setShowSaveAlert(false),
            },
            {
              text: "Yes",
              handler: handleSaveToBackend, // Navigate to PredictionPage
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default HairPic;

