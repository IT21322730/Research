import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { IonIcon } from '@ionic/react';
import { cameraReverseOutline } from 'ionicons/icons';

const CameraComponent: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile) {
      setIsCameraAvailable(true);
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Web camera not supported on this device or insecure connection.');
        setErrorMessage('Web camera not supported on this device or insecure connection.');
        setIsCameraAvailable(false);
        return;
      }

      const startCamera = async () => {
        try {
          const constraints = {
            video: {
              facingMode: useFrontCamera ? 'user' : 'environment',
              width: { ideal: 1280 },
              height: { ideal: 1000 },
            },
          };

          console.log("Trying to access the camera...");
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch((error) => console.warn('Video play error:', error));
            };
          }
          setIsCameraAvailable(true);
          setErrorMessage(null); // Reset error message when camera is available
        } catch (error) {
          console.error('Error accessing web camera:', error);

          // Handle specific errors
          if (error.name === 'NotAllowedError') {
            setErrorMessage('Camera access denied by user.');
          } else if (error.name === 'NotFoundError') {
            setErrorMessage('No camera device found.');
          } else if (error.name === 'NotReadableError') {
            setErrorMessage('Camera is already in use by another application.');
          } else {
            setErrorMessage('An unexpected error occurred while accessing the camera.');
          }

          setIsCameraAvailable(false);
          setPhoto(null); // Reset photo if an error occurs
        }
      };

      startCamera();
    }
  }, [useFrontCamera]);

  const takePicture = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const photo = await Camera.getPhoto({
          quality: 90,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          direction: useFrontCamera ? CameraDirection.Front : CameraDirection.Rear,
        });
        setPhoto(photo.webPath || null);
      } catch (error) {
        console.error('Error capturing photo on mobile:', error);
        setErrorMessage('Error capturing photo on mobile.');
      }
    } else {
      const video = videoRef.current;
      if (video) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (context) {
          if (useFrontCamera) {
            context.translate(canvas.width, 0);
            context.scale(-1, 1); // Flip the image for front camera
          }
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          setPhoto(canvas.toDataURL('image/png'));
        }
      }
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  return (
    <div>
      {!isCameraAvailable ? (
        <div>
          {errorMessage ? (
            <p style={{ color: 'red' }}>{errorMessage}</p> // Display the error message
          ) : (
            <p>Web camera not supported on this device or permissions not granted.</p>
          )}
        </div>
      ) : !photo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover', // Ensure it covers the whole screen
            transform: useFrontCamera ? 'scaleX(-1)' : 'none', // Flip video if front camera
          }}
        ></video>
      ) : (
        <img src={photo} alt="Captured" style={{ width: '100%' }} />
      )}
      <button onClick={takePicture}>Capture Photo</button>
      <button onClick={toggleCamera}>
        <IonIcon icon={cameraReverseOutline} size="large" />
      </button>
    </div>
  );
};

export default CameraComponent;
