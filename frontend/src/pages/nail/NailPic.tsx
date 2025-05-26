import React, { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonButton,
  IonAlert,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonImg
} from "@ionic/react";
import {
  camera,
  save,
  swapHorizontal,
  warning,
  refreshCircle,
  images
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "../css/NailPic.css";
import LuxMeter from "../all/LuxMeter";

const NailPic: React.FC = () => {
  const history = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [capturedViews, setCapturedViews] = useState<{ [view: string]: string }>({});
  const [currentView, setCurrentView] = useState<string>("Palm View");
  const [missingViews, setMissingViews] = useState<string[]>(["Palm View", "Dorsal View"]);
  const [lux, setLux] = useState<number | null>(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Start/stop camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: useFrontCamera ? "user" : "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.log("Video play failed:", err));
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
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

  // Capture image from live video
  const takePicture = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        if (useFrontCamera) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL("image/png");

        setCapturedViews((prev) => {
          const updatedViews = { ...prev, [currentView]: dataUrl };
          validateCapturedViews(updatedViews);
          return updatedViews;
        });

        if (currentView === "Palm View") {
          setPhoto1(dataUrl);
        } else {
          setPhoto2(dataUrl);
        }
      }

      console.log("Captured Lux Value:", lux);
    }
  };

  // Validate if both views are captured
  const validateCapturedViews = (views: { [view: string]: string }) => {
    const requiredViews = ["Palm View", "Dorsal View"];
    const missing = requiredViews.filter((view) => !views[view]);
    setMissingViews(missing);
  };

  // Switch between front and back camera
  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  // Upload image from phone gallery
  const handleGalleryUpload = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
      });

      if (image.dataUrl) {
        setCapturedViews((prev) => {
          const updatedViews = { ...prev, [currentView]: image.dataUrl! };
          validateCapturedViews(updatedViews);
          return updatedViews;
        });

        if (currentView === "Palm View") {
          setPhoto1(image.dataUrl);
        } else {
          setPhoto2(image.dataUrl);
        }
      }
    } catch (error) {
      console.error(`Error selecting ${currentView} image from gallery:, error`);
    }
  };

  // Upload both images to the backend
  const handleSaveToBackend = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No authenticated user. Please log in.");
      return;
    }

    if (!photo1 || !photo2) {
      console.error("Both images (Palm and Dorsal) are required.");
      return;
    }

    const requestData = {
      user_uid: user.uid,
      image_data1: photo1.split(",")[1],
      image_data2: photo2.split(",")[1],
    };

    try {
      const response = await fetch("https://192.168.1.100:5000/nailpredict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(HTTP error! Status: ${response.status}, Message: ${errorText});
      }



      const data = await response.json();
      console.log("Server response:", data);

      history.push({
        pathname: "/app/nailprediction",
        state: { predictionResult: data },
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>TAKE THE PICTURE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <LuxMeter onLuxChange={setLux} />

        {!capturedViews[currentView] ? (
          <video ref={videoRef} id="video" autoPlay playsInline></video>
        ) : (
          <IonImg
            src={capturedViews[currentView]}
            alt="Captured"
            className="captured-photo"
            style={{ width: '100%', height: '480px', marginBottom: '10px' }}
          />
        )}

        <IonSegment
          value={currentView}
          onIonChange={(e) => setCurrentView(e.detail.value as string)}
        >
          <IonSegmentButton value="Palm View">
            <IonLabel>Palm View</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Dorsal View">
            <IonLabel>Dorsal View</IonLabel>
          </IonSegmentButton>
        </IonSegment>

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
          <div className="tab-button" onClick={handleGalleryUpload}>
            <IonIcon icon={images} />
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
          header="Save Images"
          message="Are you sure you want to save the captured nail images?"
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
      </IonContent>
    </IonPage>
  );
};

export default NailPic;
