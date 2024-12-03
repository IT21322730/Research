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
import '../css/FaceVideo.css'; // You can rename the CSS to FaceVideo.css
import { videocam, videocamOff, save, swapHorizontal } from 'ionicons/icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FaceVideo: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
          const videoURL = URL.createObjectURL(videoBlob);
          setRecordedVideoURL(videoURL);
        }
      };

      mediaRecorderRef.current.start();
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
      }, 1000);

      setIsRecording(true);
      setRecordedVideoURL(null);
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

    if (chunksRef.current.length > 0) {
      const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoFile = new File([videoBlob], 'video.webm', { type: 'video/webm' });

      try {
        setIsUploading(true);
        const storage = getStorage();
        const storageRef = ref(storage, `facevideos/${Date.now()}_video.webm`);
        await uploadBytes(storageRef, videoFile);

        const videoURL = await getDownloadURL(storageRef);
        setRecordedVideoURL(videoURL);
        setIsUploading(false);
      } catch (error) {
        console.error('Error uploading video:', error);
        setIsUploading(false);
      }
    } else {
      console.warn('No recorded chunks available!');
    }
  };

  const handleSaveVideo = async () => {
    if (recordedVideoURL) {
      setShowAlert(true);
    } else {
      console.log('No video recorded!');
    }
  };

  const confirmSave = async () => {
    try {
      await addDoc(collection(db, 'facevideo'), {  // Change collection name here
        videoUrl: recordedVideoURL,
        timestamp: serverTimestamp(),
      });
      console.log('Video saved successfully!');
      setShowAlert(false);  // Close the alert after saving the video
    } catch (error) {
      console.error('Error saving video:', error);
      setShowAlert(false);  // Close the alert if there's an error
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
          <div className={`recording-time ${!isRecording && recordingTime > 0 ? 'stopped' : ''}`}>
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
        <div className="tab-button">
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

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Save Video"
        message="Do you want to save this video?"
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            handler: () => console.log('Video not saved'),
          },
          {
            text: 'Yes',
            handler: confirmSave,
          },
        ]}
      />
    </IonPage>
  );
};

export default FaceVideo;
