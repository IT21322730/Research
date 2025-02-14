import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import '../css/Profile.css';
import DefaultProfilePic from '../images/img_09.png'; // Set default profile picture
import NewImage from '../images/img_08.jpg';  // Import the new image for header
import { auth, db } from '../firebase/firebase';
import { doc, onSnapshot,setDoc } from 'firebase/firestore';

const Profile: React.FC = () => {
  const history = useHistory();
  const [profilePicURL, setProfilePicURL] = useState<string>(DefaultProfilePic); // Default profile picture
  const [name, setName] = useState('Example Name');
  const [experience, setExperience] = useState('4 Years');
  const [position, setPosition] = useState('Example Ayurvedic');
  const [isEditing, setIsEditing] = useState(false); // Track whether we're editing or not
  const [inputValues, setInputValues] = useState({
    name: name,
    experience: experience,
    position: position,
  });

  const user = auth.currentUser;

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || 'Example Name');
          setExperience(data.experience || '4 Years');
          setPosition(data.position || 'Example Ayurvedic');
          setProfilePicURL(data.profilePicURL || DefaultProfilePic); // Use the profile pic URL from Firestore
        }
      });

      return () => unsubscribe();
    }
  }, []); // Ensure this effect runs only once after the component is mounted

  const handleEditClick = () => {
    setIsEditing(true);
    setInputValues({
      name: name,
      experience: experience,
      position: position,
    });
  };

  const handleInputChange = (field: 'name' | 'experience' | 'position', value: string) => {
    setInputValues({
      ...inputValues,
      [field]: value,
    });
  };

  const handleSaveChanges = async () => {
    if (user && inputValues.name && inputValues.experience && inputValues.position) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: inputValues.name,
        experience: inputValues.experience,
        position: inputValues.position,
      }, { merge: true });

      // Update state with new values
      setName(inputValues.name);
      setExperience(inputValues.experience);
      setPosition(inputValues.position);

      setIsEditing(false); // Exit edit mode
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false); // Exit edit mode without saving
  };

  const navigateToPatientInfo = () => {
    history.push('/app/patient-info'); // Navigate to the patient-info page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" style={{ color: 'black' }} />
          </IonButtons>
          <IonTitle style={{ color: 'black' }}>PROFILE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        {isEditing && (
          <div className="edit-modal">
            <div className="edit-modal-content">
              <h4>Edit Information</h4>
              <label>Name:</label>
              <input
                type="text"
                value={inputValues.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <label>Position:</label>
              <input
                type="text"
                value={inputValues.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
              <label>Experience:</label>
              <input
                type="text"
                value={inputValues.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
              />
              <div className="modal-buttons">
                <button onClick={handleSaveChanges}>Save</button>
                <button onClick={handleCancelEditing}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add the new image above the square */}
        <img src={NewImage} alt="Profile Header" style={{ width: '100%', height: 'auto' }} />

        <div className="consulation-container">
          <h3 className="consulation">My Consultation</h3>
          <h5 className="all-patient" onClick={navigateToPatientInfo}>See all</h5>
        </div>
        <div className="square">
          <div className="profile-picture-container">
            <img
              src={profilePicURL}
              alt="Profile"
              className="profile-picture"
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="profile-details">
            <h3 className="profile-name">{name}</h3>
            <p className="profile-position">{position}</p>
            <p className="profile-position">{experience}</p>
            {!isEditing && (
              <p className="edit-information">
                You want to edit your information? <a onClick={handleEditClick}>Click this</a>
              </p>
            )}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Profile;