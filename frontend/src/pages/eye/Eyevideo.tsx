import React, { useRef, useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAlert,
} from '@ionic/react';
import '../css/Eyevideo.css';
import { videocam, videocamOff, save, swapHorizontal ,refreshCircle} from 'ionicons/icons';
import axios, { AxiosError } from 'axios'; // Import AxiosError
import { useHistory } from 'react-router-dom';
import Reloader from '../all/Reloader'; // Import Reloader component

const Eyevideo: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login state
  const [loading, setLoading] = useState<boolean>(false);
  const [isPredictionInProgress, setIsPredictionInProgress] = useState<boolean>(false); // Track prediction state
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const history = useHistory();

  useEffect(() => {
    // Check if the user is logged in (example: checking localStorage)
    const userLoggedIn = localStorage.getItem('isLoggedIn'); // Adjust based on your app's logic

    // If user is not logged in and page has not been reloaded yet, force a reload
    if (!userLoggedIn && !localStorage.getItem('pageReloaded')) {
      localStorage.setItem('pageReloaded', 'true'); // Set the flag to prevent infinite reloads
      window.location.reload(); // Force page reload
    } else {
      setIsLoggedIn(true); // Set user as logged in
    }
  }, []);

  // Start recording
  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideoURL(videoURL);
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        handleStopRecording();
      }, 30000);// 30 seconds
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Show confirmation alert
  const handleSaveVideo = () => {
    setShowAlert(true);
  };

  // Upload video to backend and navigate
  const confirmSave = async () => {
    setShowAlert(false); // Dismiss the alert immediately after clicking "Yes"

    if (!recordedVideoURL) return;

    setIsProcessing(true); // Show loading
    setIsPredictionInProgress(true); // Show reloader during prediction
    setLoading(true); // Set loading to true to show Reloader

    try {
      const formData = new FormData();
      const videoBlob = await fetch(recordedVideoURL).then((res) => res.blob());
      formData.append('video', videoBlob, 'video.webm');

      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Handle successful response
      if (response.data && response.data.document_id) {
        const documentId = response.data.document_id;
        console.log('Backend response received. documentId:', documentId);
        history.push(`/app/blink-prediction/${documentId}`); // Navigate with document ID
        
      } else {
        console.error('No document_id returned from the backend.');
      }
    } catch (error: unknown) {
      // Type guard to check if it's an AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error uploading video:', error.response.data);
        } else {
          console.error('Error uploading video:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false); // Hide reloader when loading is complete
      setIsProcessing(false); // Hide loading spinner
      setIsPredictionInProgress(false); // Hide reloader once prediction is done
    }
  };

  const cancelSave = () => {
    setShowAlert(false); // Dismiss the alert if "No" is clicked
  };

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/blink" />
          </IonButtons>
          <IonTitle>TAKE VIDEO</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="video-content">
        <video
          ref={videoRef}
          className="video-fullscreen"
          autoPlay
          muted
          style={{ display: isRecording ? 'block' : 'none' }}
        />

        {isRecording && <div className="recording-time">Recording Time: {recordingTime}s</div>}

        {recordedVideoURL && (
          <div className="playback-container">
            <video src={recordedVideoURL} controls className="video-playback" />
          </div>
        )}
      </IonContent>

      <div className="tab-bar">
        <div className="tab-button">
        <div className="tab-button" onClick={() => window.location.reload()}>
                    <IonIcon icon={refreshCircle} />
                  </div>
        </div>
        <div className="tab-button" onClick={toggleCamera}>
                    <IonIcon icon={swapHorizontal} />
                  </div>
        <div className="tab-button">
          <IonButton onClick={isRecording ? handleStopRecording : handleStartRecording} fill="clear">
            <IonIcon icon={isRecording ? videocamOff : videocam} />
          </IonButton>
        </div>
        <div className="tab-button">
          <IonButton onClick={handleSaveVideo} fill="clear">
            <IonIcon icon={save} />
          </IonButton>
        </div>
      </div>

      {loading && <Reloader />} {/* Display Reloader when loading */}

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)} // Ensures the alert closes when dismissed
        header="Save Video"
        message="Do you want to save this video?"
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            handler: cancelSave, // Close alert if "No"
          },
          {
            text: 'Yes',
            handler: confirmSave, // Start the save process when "Yes"
          },
        ]}
      />
    </IonPage>
  );
};

export default Eyevideo; // Ensure this is the last line in the file
