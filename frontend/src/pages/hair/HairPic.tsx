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
import LuxMeter from "../all/LuxMeter";

const HairPic: React.FC = () => {
  const history = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [capturedViews, setCapturedViews] = useState<{ [view: string]: string }>({});
  const [currentView, setCurrentView] = useState<string>("Front View");
  const [missingViews, setMissingViews] = useState<string[]>(["Front View", "Back View", "Scalp View"]);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [lux, setLux] = useState<number | null>(null);
  const [fileInputRef] = useState(React.createRef<HTMLInputElement>());

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
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(-1, 0, 0, 1, canvas.width, 0);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL("image/png");
        setPhoto(dataUrl);

        console.log("Captured Lux Value:", lux);

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

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  const handleSaveToBackend = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

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
      user_uid: user.uid,
      patient_uid: "patient456",
      image_data: capturedImages.map((img) => img.split(",")[1]),
    };

    try {
      const response = await fetch("https://192.168.1.100:5000/process-hair-images", {
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

      history.push({
        pathname: "/app/hair-results",
        state: { prakrutiResult: data },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length !== 3) {
      alert("Please select exactly 3 images.");
      return;
    }

    const views = ["Front View", "Back View", "Scalp View"];
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
      const newCapturedViews: { [key: string]: string } = {};
      for (let i = 0; i < images.length; i++) {
        newCapturedViews[views[i]] = images[i];
      }
      setCapturedViews(newCapturedViews);
      setPhoto(images[views.indexOf(currentView)] || images[0]);
 // Display first image
      validateCapturedViews(newCapturedViews);
    });
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
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>TAKE THE PICTUER</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <LuxMeter onLuxChange={setLux} />
        {!photo ? (
          <video ref={videoRef} id="video" autoPlay playsInline></video>
        ) : (
          <IonImg
            src={photo}
            alt="Captured Photo"
            className="captured-photo"
            style={{ width: "100%", height: "480px", marginBottom: "10px" }}
          />
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
            <IonButton
              onClick={() => fileInputRef.current?.click()}
              style={{ background: "none", border: "none", padding: "0" }}
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
      </IonContent>
    </IonPage>
  );
};

export default HairPic;