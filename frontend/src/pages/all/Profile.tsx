import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonAlert,
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { auth, db } from '../firebase/firebase'; // Relative path to firebase.js
import { doc, onSnapshot, setDoc } from 'firebase/firestore'; // Import Firestore functions
import '../css/Profile.css'; // Import your CSS styles
import { useHistory } from 'react-router-dom'; // Changed to useHistory

const Profile: React.FC = () => {
  const history = useHistory();

  const [selectedImage, setSelectedImage] = useState('https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [showAlert, setShowAlert] = useState(false); // State for showing the alert
  const [tempName, setTempName] = useState('');
  const [tempAge, setTempAge] = useState('');
  const [tempSex, setTempSex] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || '');
      
      // Real-time listener for user profile
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setSex(data.sex || '');
          setAge(data.age || '');
          setSelectedImage(data.profilePicture || selectedImage); // Load the image if exists
        }
      });
  
      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, []);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        updateProfilePicture(reader.result as string); // Update Firestore with new picture
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to update the user's profile picture in Firestore
  const updateProfilePicture = async (imageUrl: string) => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        profilePicture: imageUrl, // Save the new profile picture URL
      }, { merge: true });
    }
  };

  // Handle Edit Information click
  const handleEditClick = () => {
    // Populate temporary fields with current values
    setTempName(name);
    setTempAge(age);
    setTempSex(sex);
    setIsEditing(true);
  };

  // Handle Save changes
  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: tempName,
          age: tempAge,
          sex: tempSex,
          image: selectedImage // Save the selected image if needed
        }, { merge: true });
  
        // Update state with new values
        setName(tempName);
        setAge(tempAge);
        setSex(tempSex);
        setIsEditing(false); // Exit edit mode after saving
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" style={{ color: 'black' }}/>
          </IonButtons>
          <IonTitle style={{ color: 'black' }}>PROFILE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="profile-container">
          <div className="profile-pic-container" onClick={() => document.getElementById('file-input')?.click()}>
            <img src={selectedImage} alt="Profile" className="profile-pic" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }} // Hide the file input
              id="file-input"
            />
          </div>
  
          {/* Render the Edit Information button only if not in edit mode */}
          {!isEditing && (
            <button className='edit-button' onClick={handleEditClick}>
              Edit Information
            </button>
          )}
  
          <div className="profile-info-box">
            {isEditing ? (
              <div className="modal-content"> {/* Add this div with the class here */}
                <div className="modal-input">
                  <label>Enter Your Name</label>
                  <IonInput value={tempName} onIonChange={(e) => setTempName(e.detail.value!)} />
                </div>
                <div className="modal-input">
                  <label>Enter your Age</label>
                  <IonInput type="number" value={tempAge} onIonChange={(e) => setTempAge(e.detail.value!)} />
                </div>
                <div className="modal-input">
                  <label>Enter your Gender</label>
                  <IonRadioGroup value={tempSex} onIonChange={(e) => setTempSex(e.detail.value)}>
                    <IonItem>
                      <IonLabel style={{ fontFamily: 'Comic Sans MS' }}>Male</IonLabel>
                      <IonRadio slot="start" value="Male" />
                    </IonItem>
                    <IonItem>
                      <IonLabel style={{ fontFamily: 'Comic Sans MS' }}>Female</IonLabel>
                      <IonRadio slot="start" value="Female" />
                    </IonItem>
                    <IonItem>
                      <IonLabel style={{ fontFamily: 'Comic Sans MS' }}>Other</IonLabel>
                      <IonRadio slot="start" value="Other" />
                    </IonItem>
                  </IonRadioGroup>
                </div>
                <button className='edit-button' onClick={handleSave}>Save Changes</button>
                <button className='logout-button' onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="profile-info-item">
                  <strong>Your Name: </strong>
                  <span>{name}</span>
                </div>
                <div className="profile-info-item">
                  <strong>Age: </strong>
                  <span>{age}</span>
                </div>
                <div className="profile-info-item">
                  <strong>Email: </strong>
                  <span>{email}</span>
                </div>
                <div className="profile-info-item">
                  <strong>Sex: </strong>
                  <span>{sex}</span>
                </div>
              </>
            )}
          </div>
  
          {/* Alert for edit information */}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Edit Information'}
            message={'Do you want to edit your profile information?'}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  setShowAlert(false);
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  setShowAlert(false);
                  handleEditClick(); // Open edit mode if confirmed
                }
              }
            ]}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};  

export default Profile;
