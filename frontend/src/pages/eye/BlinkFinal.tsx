import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonButtons, IonBackButton, IonText } from '@ionic/react';
import '../css/BlinkFinal.css'; // Create this CSS file for styling

const BlinkFinal: React.FC = () => {
  const stressLevel = 'Medium'; // Example stress level
  const data = {
    high: 30,
    low: 20,
    medium: 50,
  };

  const total = data.high + data.low + data.medium;

  const calculateStrokeDasharray = (value: number) => {
    return `${(value / total) * 100} ${100 - (value / total) * 100}`;
  };

  const lowOffset = calculateStrokeDasharray(data.low).split(' ')[0];
  const mediumOffset = parseFloat(lowOffset) + parseFloat(calculateStrokeDasharray(data.medium).split(' ')[0]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/eyehome" />
          </IonButtons>
          <IonTitle>Blink Final</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="content-container">
          <IonText>
            <h2>Your stress level is: {stressLevel}</h2>
          </IonText>

          <svg width="200" height="200">
            <circle cx="100" cy="100" r="70" stroke="lightgray" strokeWidth="30" fill="none" />
            <circle cx="100" cy="100" r="70" stroke="green" strokeWidth="30" fill="none" strokeDasharray={calculateStrokeDasharray(data.low)} strokeDashoffset={0} />
            <circle cx="100" cy="100" r="70" stroke="orange" strokeWidth="30" fill="none" strokeDasharray={calculateStrokeDasharray(data.medium)} strokeDashoffset={lowOffset} />
            <circle cx="100" cy="100" r="70" stroke="red" strokeWidth="30" fill="none" strokeDasharray={calculateStrokeDasharray(data.high)} strokeDashoffset={mediumOffset} />
          </svg>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BlinkFinal;
