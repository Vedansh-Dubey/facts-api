import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OTPInput from 'otp-input-react';
import { Button } from 'antd';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUserShield } from '@fortawesome/free-solid-svg-icons';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

function App() {
  const [phone, setPhone] = useState('');
  const [OTP, setOTP] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // Remove the call to sendOTP() from here
      },
      'expired-callback': () => {
        alert('reCAPTCHA verification expired. Please try again.');
        window.location.reload();
      },
      timeout: 60000,
    });
    
  }, []);

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const phoneCheck = () => {
    if (phone === '') {
      alert('Please enter a valid phone number.');
      window.location.reload();
    }
    else{
      sendOTP();
    }

  }

  const sendOTP = () => {
      firebase
      .auth()
      .signInWithPhoneNumber(`+${phone}`, window.recaptchaVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setShowOTP(true);
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        alert('An error occurred while sending the OTP.');
      });
  };

  const handleVerify = () => {
    confirmationResult
      .confirm(OTP)
      .then((result) => {
        var user = result.user;
        console.log('User authenticated:', user);
        alert('OTP verification successful!');
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        alert('An error occurred while verifying the OTP. Please try again.');
      });
  };

  return (
    <div className="App">
      <h1 className="AppTitle">
        Welcome!
        <br />
        Please Login
      </h1>
      <form className="AppForm">
        {showOTP ? (
          <div className="InputWrapper">
            <FontAwesomeIcon icon={faUserShield} style={{ color: '#ffffff', fontSize: '65px' }} />
            <label className="InputLabel">Verify Your OTP</label>
            <OTPInput
              value={OTP}
              onChange={setOTP}
              autoFocus
              OTPLength={6}
              otpType="number"
              disabled={false}
            />
            <Button className="FormButton" type="primary" onClick={handleVerify}>
              Verify
            </Button>
          </div>
        ) : (
          <div className="InputWrapper">
            <FontAwesomeIcon icon={faPhone} style={{ color: '#ffffff', fontSize: '55px' }} />
            <label className="InputLabel">Verify Your Phone Number</label>
            <PhoneInput country={'in'} value={phone} onChange={handlePhoneChange} />
            <Button className="FormButton" type="primary" onClick={phoneCheck}>
              Send OTP
            </Button>
          </div>
        )}
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default App;