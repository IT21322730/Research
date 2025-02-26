import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonSearchbar, IonButtons, IonBackButton } from '@ionic/react';
import { db, collection, query, where, onSnapshot } from '../firebase/firebase';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import '../css/Search.css';
import DefaultProfilePic from '../images/img_07.png';

// Define the Patient interface
interface Patient {
  id: string;
  name: string;
  age: string;
  date: string;
  prakurthiType: string;
  user_id: string;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, where('user_id', '==', user.uid));

      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const patientsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Patient[];

        setPatients(patientsList);
        setFilteredPatients(patientsList); // Initialize filteredPatients with all patients
      });

      return () => unsubscribeFirestore();
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(patient =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, patients]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/profile" style={{ color: 'black' }} />
          </IonButtons>
          <IonSearchbar
  className="custom-searchbar"
  value={searchQuery}
  onIonInput={(e) => setSearchQuery(e.detail.value!)}
  debounce={300}
  showClearButton="always"
  placeholder="Search by Patient Name"
  
/>
    
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div className="patient-details" key={patient.id}>
              <div className="patient-details-card">
                <div className="patient-info">
                  <div className="patient-profile-picture-container">
                    <img
                      src={DefaultProfilePic}
                      alt="Patient Profile"
                      className="patient-profile-picture"
                    />
                  </div>
                  <div className="patient-info-details">
                    <div className="patient-details-text">
                      <strong>Name: </strong>{patient.name}
                    </div>
                    <div className="patient-details-text">
                      <strong>Prakurthi Type: </strong>{patient.prakurthiType}
                    </div>
                    <div className="patient-details-text">
                      <strong>Age: </strong>{patient.age}
                    </div>
                    <div className="patient-details-text">
                      <strong>Date: </strong>{patient.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '20px' }}>
            No patients found
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Search;
