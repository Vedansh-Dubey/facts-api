import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import './authPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import OTPInputComponent from '../../components/OTPInputComponent';
import PhoneInputComponent from '../../components/PhoneInputComponent';
import generateUniqueKey from '../../utils/firebaseUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_REALTIME_DATABASE,
});

const AuthPage = () => {
  const [phone, setPhone] = useState('');
  const [OTP, setOTP] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          toast.error('reCAPTCHA verification expired. Please try again.');
          window.location.reload();
        },
        timeout: 60000,
      }
    );
  }, []);

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const phoneCheck = () => {
    if (phone === '') {
      toast.error('Please enter a valid phone number.');
      window.location.reload();
    } else {
      sendOTP();
    }
  };

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
        toast.error('An error occurred while sending the OTP.');
      });
  };

  const handleOTPChange = (value) => {
    setOTP(value);
  };

  const handleVerify = () => {
    confirmationResult
      .confirm(OTP)
      .then((result) => {
        var user = result.user;
        console.log('User authenticated:', user);
        toast.success('OTP verification successful!');
        const userId = user.uid;
        const database = firebase.database();
        const userRef = database.ref('Users/' + userId);
        userRef.once('value', (snapshot) => {
          if (!snapshot.exists()) {
            generateUniqueKey()
              .then((apiKey) => {
                console.log('', apiKey);
                const defaultValues = {
                  username: userId,
                  fixedQuota: 200,
                  APIKeys: {
                    defaultKey: {
                      key: apiKey,
                      name: 'Default Key',
                      usage: 0,
                    },
                  },
                };
                const updates = {};
                updates['Users/' + userId] = defaultValues;
                database
                  .ref()
                  .update(updates)
                  .then(() => {
                    console.log('New user node created successfully!');
                  })
                  .catch((error) => {
                    console.error('Error creating user node:', error);
                  });
              })
              .catch((error) => {
                console.error('Error generating unique API key:', error);
              });
          }
          navigate(`/ApiDashboard/${user.uid}`);
        });
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        toast.error('An error occurred while verifying the OTP. Please try again.');
      });
  };

  return (
    <div className="Auth">
      <h1 className="AuthTitle">
        Welcome!
        <br />
        Please Login
      </h1>
      <form className="AuthForm">
        {showOTP ? (
          <div className="InputWrapper">
            <FontAwesomeIcon
              icon={faUserShield}
              style={{ color: '#ffffff', fontSize: '65px' }}
            />
            <label className="InputLabel">Verify Your OTP</label>
            <OTPInputComponent
              OTP={OTP}
              handleOTPChange={handleOTPChange}
              handleVerify={handleVerify}
            />
            <Button className="FormButton" type="primary" onClick={handleVerify}>
              Verify
            </Button>
          </div>
        ) : (
          <div className="InputWrapper">
            <FontAwesomeIcon
              icon={faPhone}
              style={{ color: '#ffffff', fontSize: '55px' }}
            />
            <label className="InputLabel">Verify Your Phone Number</label>
            <PhoneInputComponent
              phone={phone}
              handlePhoneChange={handlePhoneChange}
            />
            <Button className="FormButton" type="primary" onClick={phoneCheck}>
              Send OTP
            </Button>
          </div>
        )}
      </form>
      <div id="recaptcha-container"></div>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
