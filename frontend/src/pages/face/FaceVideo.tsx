import React, { useRef, useState } from 'react';
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
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/FaceVideo.css';
import { videocam, videocamOff, save, swapHorizontal,refreshCircle } from 'ionicons/icons';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const FaceVideo: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emotionResult, setEmotionResult] = useState<string | null>(null);
  const [emotionCount, setEmotionCount] = useState<number | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const history = useHistory(); // Initialize history for navigation

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const db = getFirestore();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((error) => {
            console.error('Error playing video:', error);
          });
        };
      }

      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (chunksRef.current.length > 0) {
          const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
          setRecordedVideoBlob(videoBlob);
          setRecordedVideoURL(URL.createObjectURL(videoBlob));
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordedVideoURL(null);
      setRecordedVideoBlob(null);
      setEmotionResult(null);
      setEmotionCount(null);

      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
        if (seconds >= 10) {
          handleStopRecording();
        }
      }, 1000);
    } catch (error) {
      console.error('Error accessing media devices or starting recording.', error);
      alert('Unable to access your camera or start recording.');
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRecordingTime(0);
    setIsRecording(false);
  };

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

 const handleSaveVideo = async () => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently logged-in user

  if (!user) {
    console.error("No authenticated user found. Please log in.");
    return;
  }

  if (!recordedVideoBlob) {
    console.log("No recorded video available!");
    return;
  }

  setIsUploading(true);
  const formData = new FormData();
  formData.append("video", recordedVideoBlob, "video.webm");
  formData.append("user_uid", user.uid); // Send user UID to backend

  try {
    const response = await fetch("http://127.0.0.1:5000/analyze-micro-expressions", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    console.log("Backend response:", data);

    if (data.emotion_percentages) {
      // Get the dominant emotion (the one with the highest percentage)
      const dominantEmotion = Object.keys(data.emotion_percentages).reduce((a, b) =>
        data.emotion_percentages[a] > data.emotion_percentages[b] ? a : b
      );

      setEmotionResult(dominantEmotion);
      setEmotionCount(data.emotion_percentages[dominantEmotion]);

      history.push({
        pathname: "/app/face-video-prediction",
        state: {
          emotion_percentages: data.emotion_percentages, // ✅ Pass all emotions!
          psychological_insights: data.psychological_insights,
          recommendations: data.recommendations,
          message: data.message,
        },
      });
    } else {
      console.log("No emotions detected!");
    }
  } catch (error) {
    console.error("Error sending video to backend:", error);
  } finally {
    setIsUploading(false);
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/facemicro" />
          </IonButtons>
          <IonTitle>TAKE FACE VIDEO</IonTitle>
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

        {isRecording && (
          <div className="recording-time">
            Recording Time: {recordingTime}s
          </div>
        )}

        {recordedVideoURL && (
          <div className="playback-container">
            <video src={recordedVideoURL} controls className="video-playback" />
          </div>
        )}

        {isUploading && <div className="loading-spinner">Uploading...</div>}
      </IonContent>

      <div className="tab-bar">
        <div className="tab-button" onClick={() => window.location.reload()}>
                    <IonIcon icon={refreshCircle} />
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
          <IonButton onClick={() => setShowSaveAlert(true)} fill="clear">
            <IonIcon icon={save} />
          </IonButton>
        </div>
      </div>

      {/* Save Confirmation Alert */}
      <IonAlert
        isOpen={showSaveAlert}
        onDidDismiss={() => setShowSaveAlert(false)}
        header="Save Video"
        message="Are you sure you want to save and analyze the video?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Save',
            handler: () => {
              handleSaveVideo(); // Call function to save and analyze
            },
          },
        ]}
      />
    </IonPage>
  );
};

export default FaceVideo;
