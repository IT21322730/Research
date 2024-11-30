import React, { useState } from 'react';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonBackButton } from '@ionic/react';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import this method from firebase/auth
import { auth } from '../firebase/firebase'; // Import your Firebase auth instance
import '../css/ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email); // Use the auth instance to send the reset email
      setMessage('Verification code sent to your email! Check your inbox to reset your password.');
      setIsCodeSent(true);
    } catch (error) {
      setMessage('Error sending verification code. Please try again.');
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" style={{ color: 'black' }} />
          </IonButtons>
          <IonTitle style={{ color: 'black' }}>FORGOT PASSWORD?</IonTitle>
        </IonToolbar>
      </IonHeader>
    
      <IonContent className="signup-content">
        <div className="signup-container">
          <h1 className="greeting"><strong>Hello👋</strong></h1>
          <h2 className="sign-in-prompt"><strong>Forgot Password?</strong></h2><br/>

          {!isCodeSent ? (
            <form className="login-form" onSubmit={handleSendCode}>
              <input 
                type="email" 
                value={email}
                onChange={handleEmailChange}
                className="form-input" 
                placeholder="Enter your Email Address" 
                required 
              />              
              <button type="submit" className="signup-button">Send Verification Code</button>
            </form>
          ) : (
            <p>{message}</p>
          )}
          <p className="login-text">
            <a href="/login" className="register-link"><b>Back To Login</b></a>
          </p>
        </div>
      </IonContent>
    </>
  );
};

export default ForgotPassword;
