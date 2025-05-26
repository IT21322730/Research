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
import { camera, save, swapHorizontal, warning, refreshCircle, images } from "ionicons/icons";
import "../css/FacePic.css";
import { useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";
import LuxMeter from "../all/LuxMeter";
import Reloader from '../all/Reloader';

const FacePic: React.FC = () => {
  const history = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [capturedViews, setCapturedViews] = useState<{ [view: string]: string }>({});
  const [currentView, setCurrentView] = useState<string>("Front View");
  const [missingViews, setMissingViews] = useState<string[]>(["Front View", "Left View", "Right View"]);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lux, setLux] = useState<number | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: useFrontCamera ? "user" : "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((error) => console.log("Video play error:", error));
        }
      } catch (error) {
        console.error("Camera error:", error);
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
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(-1, 0, 0, 1, canvas.width, 0);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL("image/png");
        setPhoto(dataUrl);

        console.log("Captured Lux Value:", lux);

        setCapturedViews((prev) => {
          const updated = { ...prev, [currentView]: dataUrl };
          validateCapturedViews(updated);
          return updated;
        });
      }
    }
  };

  const validateCapturedViews = (views: { [view: string]: string }) => {
    const requiredViews = ["Front View", "Left View", "Right View"];
    const missing = requiredViews.filter((view) => !views[view]);
    setMissingViews(missing);
  };

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  const handleSaveToBackend = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User not logged in.");
      return;
    }

    const capturedImages = Object.values(capturedViews);
    if (capturedImages.length !== 3) {
      console.error("Exactly 3 images are required.");
      return;
    }

    const requestData = {
      user_uid: user.uid,
      image_data: capturedImages.map((img) => img.split(',')[1])
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/process-face-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response:", data);

      history.push({
        pathname: "/app/face-prakurthi-prediction",
        state: { prakrutiResult: data },
      });

    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPhotos = () => {
    setPhoto(null);
    setCapturedViews({});
    setMissingViews(["Front View", "Left View", "Right View"]);
  };

  // 📁 Handle image selection from gallery
  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length === 3) {
    const views = ["Front View", "Left View", "Right View"];
    const newCapturedViews: { [view: string]: string } = {};

    for (let i = 0; i < 3; i++) {
      const file = files[i];
      const base64 = await toBase64(file);
      newCapturedViews[views[i]] = base64;
    }

    setCapturedViews(newCapturedViews);
    validateCapturedViews(newCapturedViews);
    setCurrentView("Right View"); // ✅ This line sets Right View as selected
    setPhoto(newCapturedViews["Right View"]);
  } else {
    alert("Please select exactly 3 images.");
  }
};

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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
        {loading && <Reloader />}

        {!photo ? (
          <video ref={videoRef} id="video" autoPlay playsInline></video>
        ) : (
          <IonImg src={photo} className="captured-photo" style={{ width: '100%', height: '480px' }} />
        )}

        <IonSegment value={currentView} onIonChange={(e) => {
          setCurrentView(e.detail.value as string);
          setPhoto(capturedViews[e.detail.value as string] || null);
        }}>
          <IonSegmentButton value="Front View">
            <IonLabel>Front View</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Left View">
            <IonLabel>Left View</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Right View">
            <IonLabel>Right View</IonLabel>
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
          <div className="tab-button">
            <label>
              <IonIcon icon={images} />
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleGallerySelect}
              />
            </label>
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
            { text: "No", role: "cancel" },
            { text: "Yes", handler: handleSaveToBackend }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default FacePic;
