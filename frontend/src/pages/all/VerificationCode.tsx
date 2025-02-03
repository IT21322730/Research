import React, { useState } from 'react';
import { IonContent, IonHeader, IonToolbar, IonIcon, IonButtons, IonTitle, IonBackButton } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import '../css/Signup.css';

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState('https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg');
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" style={{ color: 'black' }} />
          </IonButtons>
          <IonTitle style={{ color: 'black' }}>VERIFICATION</IonTitle>
        </IonToolbar>
      </IonHeader>
    
      <IonContent className="signup-content">
        <div className="signup-container">
          <label htmlFor="file-input">
            <img
              src={selectedImage} // Display the selected image
              alt="Profile"
              className="profile-pic"
              style={{ cursor: 'pointer' }}
            />
          </label>
          
          <h1 className="greeting"><strong>Hello👋</strong></h1>
          <h2 className="sign-in-prompt"><strong>Verify</strong></h2><br/>

          <form className="login-form">
            <input 
              type="text" 
              id="username" 
              className="form-input" 
              placeholder="Enter your Email Address" 
            />              

            <button className="signup-button">Send</button>
          </form>

          <p className="login-text">
            <a href="/login" className="register-link"><b>Back To Login</b></a>
          </p>
        </div>
      </IonContent>
    </>
  );
};

export default Signup;
