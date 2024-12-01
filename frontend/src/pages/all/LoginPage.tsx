import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonToolbar, IonIcon, IonButtons, IonTitle, IonBackButton, IonToast } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { handleLogin } from '../firebase/auth'; // Import the login function
import '../css/LoginPage.css';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import img_01 from '../images/img_01.jpeg';

const Login = () => {
  const history = useHistory(); // Initialize history for navigation
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Changed from username to password
  const [toastMessage, setToastMessage] = useState(''); // State for toast message

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // Check if the page has already been refreshed in this session
    const isRefreshed = sessionStorage.getItem('isLoginPageRefreshed');

    if (!isRefreshed) {
      // Set the flag in sessionStorage to indicate the page has been refreshed
      sessionStorage.setItem('isLoginPageRefreshed', 'true');
      // Refresh the page only once when navigating back to the Login page
      window.location.reload();
    }
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    const success = await handleLogin(email, password); // Call the login function

    if (success) {
      setToastMessage("User logged in successfully!"); // Set the success message for the toast
      history.push('/app/home'); // Navigate to home page if login is successful
    } else {
      setToastMessage("Login failed. Please check your credentials and try again."); // Set the failure message for the toast
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

      {/* IonToast component to show the toast message */}
      <IonToast
        isOpen={!!toastMessage} // Show toast if there's a message
        message={toastMessage} // Display the toast message
        duration={2000} // Duration of toast message
        onDidDismiss={() => setToastMessage('')} // Hide the toast after it disappears
        className="toast-rounded" // Apply the rounded toast style
      />
    </>
  );
};

export default Login;
