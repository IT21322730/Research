import React, { useEffect, useState, useRef } from "react";
import { IonCard, IonCardContent, IonText } from "@ionic/react";

interface LuxMeterProps {
  onLuxChange: (lux: number) => void;
}

const LuxMeter: React.FC<LuxMeterProps> = ({ onLuxChange }) => {
  const [lux, setLux] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Analyzing light... 🔍");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const luxTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Store timeout reference

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((error) => console.warn("Video play error:", error));
          };
        }

        analyzeBrightness(); // Start brightness analysis
      } catch (error) {
        console.error("Error accessing camera:", error);
        setMessage("❌ Camera not accessible");
      }
    };

    startCamera();

    return () => {
      console.log("Cleaning up LuxMeter...");
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (luxTimeoutRef.current) {
        clearTimeout(luxTimeoutRef.current); // Clean up timeout
      }
    };
  }, []);

  const analyzeBrightness = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const updateLux = () => {
      if (!videoRef.current || !canvasRef.current) return;

      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const pixels = imageData.data;
      let totalBrightness = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        // Use grayscale luminance formula to estimate brightness
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;
      }

      const avgBrightness = totalBrightness / (pixels.length / 4);
      const estimatedLux = Math.round((avgBrightness / 255) * 1000);

      setLux(estimatedLux);
      onLuxChange(estimatedLux); // Send lux value to parent component

      if (!luxTimeoutRef.current) {
        luxTimeoutRef.current = setTimeout(() => {
          sendLuxToBackend(estimatedLux);
          luxTimeoutRef.current = null;
        }, 2000); // Send lux value every 2 seconds
      }

      animationFrameRef.current = requestAnimationFrame(updateLux); // Continuously update brightness
    };

    updateLux(); // Start animation loop
  };

  const sendLuxToBackend = (luxValue: number) => {
    fetch("https://192.168.1.100:5000/analyze-light", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lux: luxValue }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => console.error("Error sending lux:", error));
  };

  const getMessageColor = () => {
    if (!lux) return "medium"; // Default color

    if (lux < 100 || lux > 1000) return "danger"; // ❌ Too dark or overexposed
    if (lux >= 100 && lux < 300) return "warning"; // ⚠️ Slightly dim
    if (lux >= 300 && lux <= 600) return "success"; // ✅ Best lighting
    return "primary"; // Acceptable but slightly bright
  };

  return (
    <>
      {/* Display Lux Level & Message */}
      <IonCard
        style={{
          position: "absolute",
          top: "1vh", // 5% of viewport height for spacing
          left: "50%", // Center horizontally
          transform: "translateX(-50%)", // Ensures perfect centering
          width: "95%", // Responsive width
          maxWidth: "400px", // Prevents it from getting too wide on big screens
          zIndex: 10,
        }}
      >
        <IonCardContent>
          <IonText color="dark">
            <h3>💡 Lux Level: <strong>{lux !== null ? lux : "Calculating..."}</strong></h3>
          </IonText>
          <IonText color={getMessageColor()}>
            <h3>{message}</h3>
          </IonText>
        </IonCardContent>
      </IonCard>

      {/* Hidden video and canvas for brightness analysis */}
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} width="100" height="100" style={{ display: "none" }}></canvas>
    </>
  );
};

export default LuxMeter;