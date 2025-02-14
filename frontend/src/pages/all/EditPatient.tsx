import React, { useState, useEffect } from 'react';
import { IonContent, IonButtons, IonBackButton, IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonTextarea, IonDatetime, IonButton, IonAlert } from '@ionic/react';
import { db, updateDoc, doc, getDoc, deleteDoc } from '../firebase/firebase';
import { useParams, useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../css/EditPatient.css';

interface Patient {
  id: string;
  name: string;
  age: string;
  date: string;
  prakurthiType: string;
  user_id: string;
}

const EditPatient: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>(); // Extract patientId from route params
  const history = useHistory(); // Access history for navigation
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [prakurthiType, setPrakurthiType] = useState('');
  const [patientDate, setPatientDate] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    if (!patientId) {
      console.error("No patient ID provided");
      return;
    }

    const fetchPatientDetails = async () => {
        const patientRef = doc(db, 'patients', patientId);
        try {
          const docSnap = await getDoc(patientRef);
          if (docSnap.exists()) {
            const patientData = docSnap.data() as Patient;
            console.log("Fetched Patient Data:", patientData); // Debug log
            setPatientName(patientData.name);
            setPatientAge(patientData.age);
            setPrakurthiType(patientData.prakurthiType);
            setPatientDate(patientData.date);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching patient details: ', error);
        }
      };      

    fetchPatientDetails();
  }, [patientId]);

  const handleSave = async () => {
    if (!patientId) {
      console.error("No patient ID provided");
      return;
    }

    const patientRef = doc(db, 'patients', patientId);
    try {
      console.log("Updating patient data:", {
        name: patientName,
        age: patientAge,
        prakurthiType,
        date: patientDate,
      });

      await updateDoc(patientRef, {
        name: patientName,
        age: patientAge,
        prakurthiType: prakurthiType,
        date: patientDate,
      });

      // Directly update the state with the new data to immediately reflect the change
      setPatientName(patientName);
      setPatientAge(patientAge);
      setPrakurthiType(prakurthiType);
      setPatientDate(patientDate);

      console.log('Patient details updated successfully!');
      history.push('/app/patient-info');
    } catch (error) {
      console.error('Error updating patient details: ', error);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientId) {
      console.error("No patient ID provided");
      return;
    }

    const patientRef = doc(db, 'patients', patientId);
    try {
      await deleteDoc(patientRef);
      console.log('Patient deleted successfully');
      
      // Navigate back to the patient list after deletion
      history.push('/app/patient');
    } catch (error) {
      console.error('Error deleting patient: ', error);
    }
    setShowDeleteAlert(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/patient" />
          </IonButtons>
          <IonTitle>Edit Patient Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="edit-patient-form">
          <IonItem>
            <IonLabel position="floating">Patient Name</IonLabel>
            <IonTextarea
              value={patientName}
              onIonChange={e => setPatientName(e.detail.value!)}
              placeholder="Enter Patient Name"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Patient Age</IonLabel>
            <IonTextarea
              value={patientAge}
              onIonChange={e => setPatientAge(e.detail.value!)}
              placeholder="Enter Patient Age"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Prakurthi Type</IonLabel>
            <IonTextarea
              value={prakurthiType}
              onIonChange={e => setPrakurthiType(e.detail.value!)}
              placeholder="Enter Prakurthi Type"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Date</IonLabel>
            <IonDatetime
              value={patientDate}
              onIonChange={e => setPatientDate(e.detail.value?.toString() || '')}  // Convert to string
            />
          </IonItem>

          <IonButton className='save-patient' expand="full" color="primary" onClick={handleSave}>
            Save Changes
          </IonButton>

          <IonButton className='delete-patient' expand="full" color="danger" onClick={() => setShowDeleteAlert(true)}>
            Delete Patient
          </IonButton>
        </div>

        {/* Delete Confirmation Alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm"
          message="Are you sure you want to delete this patient?"
          buttons={[
            {
              text: 'No',
              role: 'cancel',
              handler: () => setShowDeleteAlert(false),
            },
            {
              text: 'Yes',
              handler: handleDeletePatient,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditPatient;
