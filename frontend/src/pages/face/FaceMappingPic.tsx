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
} from "@ionic/react";
import { camera, save, swapHorizontal } from "ionicons/icons";
import { getAuth } from "firebase/auth";
import { useHistory } from "react-router-dom";
import "../css/FaceMappingPic.css";

const FaceMappingPic: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const history = useHistory();
  const auth = getAuth();
  const user = auth.currentUser;

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
  }, [useFrontCamera]);

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
      }
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
  };

  const handleSaveToBackend = async () => {
    if (!photo || !user) {
      console.error("No photo taken or user not authenticated.");
      return;
    }
  
    try {
      const blob = await fetch(photo).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "face_image.png");
      formData.append("user_uid", user.uid);
  
      const response = await fetch("http://127.0.0.1:5000/analyze-face-mapping", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      const result = await response.json();
      console.log("Backend response:", result);
  
      // ✅ Pass the result as state when navigating
      history.push({
        pathname: "/app/face-mapping-prediction",
        state: {
          diagnosis_percentages: result.diagnosis_percentages,
          recommendations: result.recommendations,
          message: result.message,
        },
      });
  
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/facemapping" />
          </IonButtons>
          <IonTitle>Take a Picture</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {!photo ? (
          <video ref={videoRef} id="video" autoPlay playsInline></video>
        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" />
        )}

        <div className="tab-bar">
          <div className="tab-button" onClick={toggleCamera}>
            <IonIcon icon={swapHorizontal} />
          </div>
          <div className="tab-button" onClick={takePicture}>
            <IonIcon icon={camera} />
          </div>
          <div className="tab-button" onClick={() => setShowAlert(true)}>
            <IonIcon icon={save} />
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Save Image"}
          message={"Do you want to save this image for face mapping analysis?"}
          buttons={[
            {
              text: "No",
              role: "cancel",
              handler: () => setShowAlert(false),
            },
            {
              text: "Yes",
              handler: handleSaveToBackend,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default FaceMappingPic;
