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
import { camera, save, swapHorizontal, warning, images } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";
import "../css/Hairalophecia.css";
import LuxMeter from "../all/LuxMeter";

const HairAlopheciaPic: React.FC = () => {
  const history = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [capturedViews, setCapturedViews] = useState<{ [view: string]: string }>({});
  const [currentView, setCurrentView] = useState<string>("Front View");
  const [missingViews, setMissingViews] = useState<string[]>([
    "Front View",
    "Back View",
    "Scalp View",
    "Top of the Head View",
  ]);
  const [lux, setLux] = useState<number | null>(null);

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
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(-1, 0, 0, 1, canvas.width, 0); // mirror
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
    const required = ["Front View", "Back View", "Scalp View", "Top of the Head View"];
    const missing = required.filter((view) => !views[view]);
    setMissingViews(missing);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length !== 4) {
      alert("Please select exactly 4 images.");
      return;
    }

    const views = ["Front View", "Back View", "Scalp View", "Top of the Head View"];
    const fileReaders: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      fileReaders.push(
        new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(fileReaders).then((images) => {
      const newCaptured: { [key: string]: string } = {};
      for (let i = 0; i < images.length; i++) {
        newCaptured[views[i]] = images[i];
      }
      setCapturedViews(newCaptured);
      setPhoto(newCaptured[currentView] || images[0]);
      validateCapturedViews(newCaptured);
    });
  };

  const handleSaveToBackend = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    const capturedImages = Object.values(capturedViews);
    if (capturedImages.length !== 4) {
      console.error("Exactly 4 images must be provided.");
      return;
    }

    const requestData = {
      user_uid: user.uid,
      patient_uid: "patient456", // adjust as needed
      image_data: capturedImages.map((img) => img.split(",")[1]),
    };

    try {
      const res = await fetch("http://127.0.0.1:5000//novelty-function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      console.log("Server response:", data);

      history.push({
        pathname: "/app/hair-alohecia-results",
        state: {
          final_diagnosis: data.final_diagnosis,
          hair_texture: data.hair_texture,
          solution: data.solution,
          texture_solution: data.texture_solution,
          illness_percentages: data.illness_percentages,
        },
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    if (capturedViews[currentView]) {
      setPhoto(capturedViews[currentView]);
    } else {
      setPhoto(null);
    }
  }, [currentView, capturedViews]);

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
        <LuxMeter onLuxChange={setLux} />

        {!photo ? (
          <video ref={videoRef} id="video" autoPlay playsInline />
        ) : (
          <IonImg
            src={photo}
            alt="Captured"
            className="captured-photo"
            style={{ width: "100%", height: "480px", marginBottom: "10px" }}
          />
        )}

        <IonSegment
          value={currentView}
          onIonChange={(e) => {
            const value = e.detail.value;
            if (typeof value === 'string') {
              setCurrentView(value);
            }
          }}
        >
          <IonSegmentButton value="Front View"><IonLabel>Front</IonLabel></IonSegmentButton>
          <IonSegmentButton value="Back View"><IonLabel>Back</IonLabel></IonSegmentButton>
          <IonSegmentButton value="Scalp View"><IonLabel>Scalp</IonLabel></IonSegmentButton>
          <IonSegmentButton value="Top of the Head View"><IonLabel>Top</IonLabel></IonSegmentButton>
        </IonSegment>

        <div className="tab-bar">
          <div className="tab-button" onClick={() => setUseFrontCamera(!useFrontCamera)}>
            <IonIcon icon={swapHorizontal} />
          </div>
          <div className="tab-button" onClick={takePicture}>
            <IonIcon icon={camera} />
          </div>
          <div className="tab-button">
            <IonButton
              onClick={() => fileInputRef.current?.click()}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <IonIcon icon={images} />
            </IonButton>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="tab-button">
            <IonButton
              onClick={() => setShowSaveAlert(true)}
              disabled={missingViews.length > 0}
            >
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
            { text: "Yes", handler: handleSaveToBackend },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default HairAlopheciaPic;