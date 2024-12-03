import React from 'react';
import { IonContent, IonHeader,IonBackButton, IonPage, IonTitle, IonToolbar,IonButtons } from '@ionic/react';
import '../css/Prakurthi.css'; // Ensure this CSS file exists and matches your file structure

const Prakurthi: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
      <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/nailhome" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>YOUR PRAKURTHI</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="prakurthi-container">
          <div className="prakurthi-box">
            <h2>Your physical prakurthi is:</h2>
            <p className="body-type">Vata-Pitta (or replace with dynamic value)</p>
          </div>
          <button className="advice-button">GET THE ADVICE</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Prakurthi;
