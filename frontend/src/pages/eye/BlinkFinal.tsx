import React, { useState } from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonButtons, IonBackButton, IonText } from '@ionic/react';
import '../css/BlinkFinal.css'; // Create this CSS file for styling

const BlinkFinal: React.FC = () => {
  // Example state for fatigue level
  const [fatigueLevel, setFatigueLevel] = useState<'low' | 'normal' | 'high'>('normal');

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
            <h2>Your Blinking Rate is (blinks/min): </h2>
            <h2>Your Fatigue level is:</h2>
          </IonText>
          <div className={`fatigue-charger ${fatigueLevel}`}>
            {fatigueLevel.toUpperCase()}
          </div>
          <IonText>
            <h2>Your Stress level is: </h2>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BlinkFinal;
