import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonButtons, 
  IonBackButton, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonItem, 
  IonLabel, 
  IonTextarea, 
  IonButton, 
  IonAlert 
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import '../css/EditPatient.css';

const EditPatient: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const history = useHistory();
  
  const [prakurthiType, setPrakurthiType] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Fetch Patient Data
  useEffect(() => {
    if (!patientId) return;
  
    const fetchPatientData = async () => {
      const apiUrl = `http://127.0.0.1:5000/patients/${patientId}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok) {
          setPrakurthiType(data.prakurthiType || '');
        } else {
          console.error("⚠️ No patient found!");
        }
      } catch (error) {
        console.error("❌ Error fetching patient data:", error);
      }
    };
    
    fetchPatientData();
  }, [patientId]);
  
  // Handle Save Changes (Only updating Prakurthi Type)
  const handleSave = async () => {
    if (!patientId) {
      console.error("❌ No patient ID provided");
      return;
    }
  
    // Get the latest input value directly
    const inputElement = document.querySelector('ion-textarea');
    const updatedPrakurthiType = (inputElement as HTMLIonTextareaElement)?.value?.trim() || '';
  
    if (!updatedPrakurthiType) {
      console.error("❌ Prakurthi Type cannot be empty!");
      return;
    }
  
    try {
      const apiUrl = `http://127.0.0.1:5000/patients/${patientId}`;
      const requestBody = { prakurthiType: updatedPrakurthiType };
  
      console.log("🔥 Sending update request to backend:", requestBody);
  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log("✅ Prakurthi Type updated successfully!", responseData);
        history.push('/app/patient-info'); // Navigate after update
      } else {
        console.error("❌ Failed to update Prakurthi Type:", responseData.error);
      }
    } catch (error) {
      console.error("❌ Error updating Prakurthi Type:", error);
    }
  };
  
  
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/patient" />
          </IonButtons>
          <IonTitle>EDIT PRAKURTHI TYPE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="edit-patient-form">
          {/* Prakurthi Type */}
          <IonItem>
          <IonLabel position="floating" style={{ fontFamily: "Open Sans, sans-serif" }}>
            Prakurthi Type
          </IonLabel><br/>
          <IonTextarea
            style={{ fontFamily: "Open Sans, sans-serif" }}
            value={prakurthiType}
            onIonInput={(e) => setPrakurthiType(e.detail.value!)}
            placeholder="Enter Prakurthi Type"
          />


          </IonItem><br/>

          {/* Save Changes Button */}
          <IonButton className='save-patient' expand="full" color="primary" onClick={handleSave}>
            Save Changes
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditPatient;
