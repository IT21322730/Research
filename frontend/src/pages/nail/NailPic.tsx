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
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import "../css/FacePic.css";
import { useHistory } from "react-router-dom";

const NailPic: React.FC = () => {
  const history = useHistory();
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [capturedPhotos, setCapturedPhotos] = useState<{ [tab: number]: string }>({});
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
            console.error("Video play was interrupted:", error)
          );
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useFrontCamera, currentTab]);

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

        setCapturedPhotos((prev) => ({
          ...prev,
          [currentTab]: dataUrl,
        }));
      }
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  const handleSaveToFirebase = async () => {
    if (Object.keys(capturedPhotos).length === 0) {
      console.error("No images to save.");
      return;
    }

    try {
      const batch = collection(db, "nails");
      for (const [tab, imageUrl] of Object.entries(capturedPhotos)) {
        await addDoc(batch, { tab, imageUrl, timestamp: new Date() });
      }
      console.log("Images saved to Firebase");
      setShowToast(true);
    } catch (error) {
      console.error("Error saving images to Firebase: ", error);
    }
  };

  const confirmSave = () => {
    setShowAlert(true);
  };

  const handleSaveAlertResponse = (isSave: boolean) => {
    if (isSave) {
      handleSaveToFirebase();
      setPhoto(null);
      setCapturedPhotos({});

      if (currentTab === 2) {
        setCurrentTab(1);
        setUseFrontCamera(true);
        history.push("/app/step");
      } else {
        setCurrentTab((prev) => prev + 1);
      }
    } else {
      setShowAlert(false);
    }
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
        {!photo ? (
          <video ref={videoRef} id="video" autoPlay playsInline></video>
        ) : (
          <IonImg src={photo} alt="Captured Photo" className="captured-photo" />
        )}

        <IonSegment
          value={String(currentTab)}
          onIonChange={(e) => setCurrentTab(Number(e.detail.value))}
        >
          {[{ label: "One Pic", value: 1 }, { label: "Two Pic", value: 2 }].map(
            ({ label, value }) => (
              <IonSegmentButton key={value} value={String(value)}>
                <IonLabel style={{ fontFamily: '"Open Sans", sans-serif' }}>
                  {label}
                </IonLabel>
              </IonSegmentButton>
            )
          )}
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
          message={`Do you want to save the picture for "${currentTab === 1 ? "One Pic" : "Two Pic"}"?`}
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

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Image saved successfully!"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default NailPic;
