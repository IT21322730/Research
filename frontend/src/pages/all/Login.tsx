// src/pages/firebase/Login.jsx

import React, { useState } from 'react';
import { IonContent, IonHeader, IonToolbar, IonIcon, IonButtons, IonTitle, IonBackButton } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { handleLogin } from '../firebase/auth'; // Import the login function
import '../css/Login.css';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import img_01 from '../images/img_01.jpeg';

const Login = () => {
  const history = useHistory(); // Initialize history for navigation
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Changed from username to password

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    const success = await handleLogin(email, password); // Call the login function

    if (success) {
      alert("User logged in successfully!"); // Alert on successful login
      history.push('/app/home'); // Navigate to home page if login is successful
    } else {
      alert("Login failed. Please check your credentials and try again."); // Alert on failed login
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" style={{ color: 'black' }} showText={false} />
          </IonButtons>
          <IonTitle style={{ color: 'black' }}>LOGIN PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="login-content">
        <div className="login-container">
        <img
            src={img_01}
            alt="Profile"
            className="profile-pic"
          />
          <h1 className="sign-in-prompt"><strong>Sign in</strong></h1>

          <form className="login-form" onSubmit={onLogin}> {/* Attach the onSubmit event */}
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />

            <div className="password-container">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                className="form-input" 
                placeholder="Enter your password" 
                value={password} // Bind password state
                onChange={(e) => setPassword(e.target.value)} // Set password value
              />
              <IonIcon 
                icon={showPassword ? eyeOff : eye} 
                className="eye-icon" 
                onClick={togglePasswordVisibility} 
                style={{ cursor: 'pointer' }} 
              />
            </div>

            <p className="forgot-password">
              <a href="/forgot-password" className="forgot-password-link">Forgot your password?</a>
            </p>

            <button type="submit" className="login-button">Login</button> {/* Change to button type */}
          </form>

          <p className="register-text">
            Don’t have an account? <a href="/register" className="register-link"><b>Register Now!</b></a>
          </p>
        </div>
      </IonContent>
    </>
  );
};

export default Login;
