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
  IonToast,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import { camera, save, swapHorizontal } from "ionicons/icons";
import "../css/NailPic.css";
import { useHistory } from "react-router-dom";

const NailPic: React.FC = () => {
  const history = useHistory();
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTab, setCurrentTab] = useState<number>(1);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: useFrontCamera ? "user" : "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
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
        currentTab === 1 ? setPhoto1(dataUrl) : setPhoto2(dataUrl);
      }
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  const sendImagesToBackend = async () => {
    if (!photo1 || !photo2) {
      console.error("Both images are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/nailpredict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_data1: photo1,
          image_data2: photo2,
        }),
      });

      const result = await response.json();
      console.log("📢 Backend response:", result);

      if (response.ok) {
        setShowToast(true);
        console.log("✅ Prediction result:", result);

        // 🛠 FIX: Pass prediction data to NailPredictionPage
        history.push("/app/nailprediction", { predictionResult: result });
      } else {
        console.error("❌ Error from backend:", result.error);
      }
    } catch (error) {
      console.error("⚠️ Error sending images to backend:", error);
    }
  };

  const confirmSave = () => {
    setShowAlert(true);
  };

  const handleSaveAlertResponse = (isSave: boolean) => {
    if (isSave) {
      if (currentTab === 2) {
        sendImagesToBackend();
      } else {
        setCurrentTab(2);
      }
    }
    setShowAlert(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>Take the Picture</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <video ref={videoRef} id="video" autoPlay playsInline></video>

        <IonSegment value={String(currentTab)} onIonChange={(e) => setCurrentTab(Number(e.detail.value))}>
          <IonSegmentButton value="1">
            <IonLabel>Image 1</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="2">
            <IonLabel>Image 2</IonLabel>
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
          message={`Do you want to save the picture for "Image ${currentTab}"?`}
          buttons={[
            { text: "No", role: "cancel", handler: () => handleSaveAlertResponse(false) },
            { text: "Yes", handler: () => handleSaveAlertResponse(true) },
          ]}
        />

        <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message="Prediction completed!" duration={2000} />
      </IonContent>
    </IonPage>
  );
};

export default NailPic;
