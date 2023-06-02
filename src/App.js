import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Navigate, Routes, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; // Add this import for the Realtime Database
import { Layout, Menu } from 'antd';
import AuthPage from './pages/authPage/authPage';
import UserPage from './pages/userPage/userPage';
import DocumentationPage from './pages/documentationPage/documentationPage';

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

const { Header, Content } = Layout;

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const resetSessionTimeout = () => {
      clearTimeout(sessionTimeout);
      sessionTimeout = setTimeout(() => {
        handleLogout();
      }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
    };

    let sessionTimeout; // Declare the sessionTimeout variable here

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      resetSessionTimeout();
    });

    return () => {
      clearTimeout(sessionTimeout); // Clear the timeout on component unmount
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
  };

  return (
    <BrowserRouter>
      <Layout>
        <Header style={{padding:"0px"}}>
          <Menu theme="dark" mode="horizontal" style={{
          justifyContent: "center", gap:"5vw", alignItems:"center", height: "100%"
          }}>
            <Menu.Item key="/dashboard" style={{ borderRadius: "10px", height:"60px", alignSelf:"center",display:"flex", alignItems:"center", justifyContent:"center", width:"130px" }}> 
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/documentation" style={{ borderRadius: "10px", height:"60px", alignSelf:"center",display:"flex", alignItems:"center", justifyContent:"center", width:"130px"}}>
              <Link to="/documentation">Documentation</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Routes>
            <Route path="/dashboard" element={<UserPage uid={user?.uid} onLogout={handleLogout} />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            {user ? (
              <>
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </>
            ) : (
              <>
                <Route
                  path="/login"
                  element={
                    localStorage.getItem('auth_token') ? (
                      <Navigate to="/" replace />
                    ) : (
                      <AuthPage onLogin={setUser} />
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    localStorage.getItem('auth_token') ? (
                      <Navigate to="/" replace />
                    ) : (
                      <AuthPage />
                    )
                  }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
