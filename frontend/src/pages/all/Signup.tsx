import React, { useState } from 'react';
import { IonContent, IonHeader, IonToolbar, IonIcon, IonButtons, IonTitle, IonBackButton } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import '../css/Signup.css';
import { handleSignup } from '../firebase/auth'; // Import the signup function
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import { useIonToast } from '@ionic/react'; // Import useIonToast for notifications

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState('https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg');
  
  const history = useHistory(); // Initialize history for navigation
  const [present] = useIonToast(); // Initialize the toast for notifications

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle image upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (password !== confirmPassword) {
      present({ message: "Passwords do not match!", duration: 2000, color: 'danger' });
      return;
    }

    try {
      await handleSignup(email, password);
      present({ message: "User registered successfully!", duration: 2000, color: 'success' });
      history.push('/app/home'); // Navigate to home page on successful registration
    } catch (error) {
      // Type assertion for error
      if (error instanceof Error) {
        present({ message: "Failed to register: " + error.message, duration: 2000, color: 'danger' });
      } else {
        present({ message: "Failed to register: Unknown error occurred.", duration: 2000, color: 'danger' });
      }
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" style={{ color: 'black' }} />
          </IonButtons>
          <IonTitle style={{ color: 'black' }}>SIGNUP PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="signup-content">
        <div className="signup-container">
          <label htmlFor="file-input">
            <img
              src={selectedImage}
              alt="Profile"
              className="profile-pic"
              style={{ cursor: 'pointer' }}
            />
          </label>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          
          <h2 className="sign-in-prompt"><strong>Create an account</strong></h2>

          <form className="login-form" onSubmit={handleSubmit}>

            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <IonIcon
                icon={showPassword ? eyeOff : eye}
                className="eye-icon"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm-password"
                className="form-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <IonIcon
                icon={showPassword ? eyeOff : eye}
                className="eye-icon"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <button type="submit" className="signup-button">Sign Up</button>
          </form>

          <p className="login-text">
            Already have an account? <a href="/login" className="register-link"><b>Login Now!</b></a>
          </p>
        </div>
      </IonContent>
    </>
  );
};

export default Signup;
