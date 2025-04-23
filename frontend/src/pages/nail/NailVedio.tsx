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
import '../css/NailVedio.css';
import { videocam, videocamOff, save, swapHorizontal,refreshCircle } from 'ionicons/icons';
import { getFirestore } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { IonToast } from '@ionic/react';


const NailVideo: React.FC = () => {
  const history = useHistory();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPressToast, setShowPressToast] = useState(false);
  const [showReleaseToast, setShowReleaseToast] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);

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
        videoRef.current.play().catch((error) => console.error('Error playing video:', error));
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
          const videoURL = URL.createObjectURL(videoBlob);
          setRecordedVideoURL(videoURL);
        }
      };

      mediaRecorderRef.current.start();
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
        if (seconds >= 10) handleStopRecording();
      }, 1000);

      setIsRecording(true);
      setRecordedVideoURL(null);

      // Show "Press Finger" toast
      setShowPressToast(true);
      setTimeout(() => {
        setShowPressToast(false);
        setShowReleaseToast(true); // Show "Release Finger" toast
      }, 5000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera.');
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };


  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setRecordingTime(0);
    setIsRecording(false);
  };

  const handleSaveVideo = async () => {
    if (!recordedVideoURL) {
      console.log('No video recorded!');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // Fetch video data from URL
      const response = await fetch(recordedVideoURL);
      if (!response.ok) throw new Error('Failed to fetch video');

      const videoBlob = await response.blob();
      const formData = new FormData();
      formData.append('video', videoBlob, `nail_video_${Date.now()}.webm`);



      console.log('Uploading video to backend...');

      // Send to backend
      const backendResponse = await fetch('http://127.0.0.1:5000/crt-analysis', {
        method: 'POST',
        body: formData,
      });


      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error(`Backend error: ${backendResponse.status} - ${errorText}`);
        setErrorMessage(`Backend error: ${backendResponse.status} - ${errorText}`);
        throw new Error(`Backend error: ${backendResponse.status} - ${errorText}`);


      }

      // Here, use the backendResponse to get the JSON data
      const data = await backendResponse.json();
      console.log('Backend response:', data);

      if (data) {
        // Send the CRT data to the next page (CRT prediction result page)
        history.push({
          pathname: '/app/crt-prediction', // Redirect to the CRT prediction result page
          state: {
            circulatory_health: data.circulatory_health,
            crt_duration: data.crt_duration,
            vascular_efficiency: data.vascular_efficiency,
            recommendation: data.recommendation,
            message: data.message,
          },
        });
      } else {
        console.log('No CRT data received!');
      }
      console.log('Result before navigating:', data);
    } catch (error) {
      console.error('Error saving video:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleShowSaveAlert = () => {
    setShowSaveAlert(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/cap" />
          </IonButtons>
          <IonTitle>TAKE VIDEO</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="video-content">
        <video ref={videoRef} className="video-fullscreen" autoPlay muted style={{ display: isRecording ? 'block' : 'none' }} />
        {recordedVideoURL && <div className="playback-container"><video src={recordedVideoURL} controls className="video-playback" /></div>}
        {isUploading && <div className="loading-spinner">Uploading...</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
          <IonButton onClick={handleShowSaveAlert} fill="clear">
            <IonIcon icon={save} />
          </IonButton>
        </div>
      </div>

      {/* Press Finger Toast */}
      <IonToast
        isOpen={showPressToast}
        message="Please press your finger now."
        duration={3000} // Automatically disappears after 3 seconds
        position="top"
        onDidDismiss={() => setShowPressToast(false)}
        style={{ marginTop: '60px' }} // Moves the toast 60px down
      />

      {/* Release Finger Toast */}
      <IonToast
        isOpen={showReleaseToast}
        message="Now, release your finger slowly."
        duration={3000} // Automatically disappears after 3 seconds
        position="top"
        onDidDismiss={() => setShowReleaseToast(false)}
        style={{ marginTop: '60px' }} // Moves the toast 60px down
      />

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

export default NailVideo;
