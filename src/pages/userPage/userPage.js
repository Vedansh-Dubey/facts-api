import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import generateUniqueKey from '../../utils/firebaseUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const UserPage = () => {
  const location = useLocation();
  const uid = location.state.uid;
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const database = firebase.database();
    const userRef = database.ref('Users/' + uid);

    const fetchApiKeys = (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userApiKeys = userData.APIKeys || {};
        const keys = Object.keys(userApiKeys).map((key) => {
          return {
            id: key,
            name: userApiKeys[key].name,
            usage: userApiKeys[key].usage || 0,
            key: userApiKeys[key].key,
          };
        });
        setApiKeys(keys);
      }
    };

    userRef.on('value', fetchApiKeys);

    return () => {
      userRef.off('value', fetchApiKeys);
    };
  }, [uid]);

  const handleNewKeySubmit = async () => {
    if (newKeyName.trim() !== '') {
      const database = firebase.database();
      const apiKeyRef = database.ref('Users/' + uid + '/APIKeys');

      try {
        const apiKey = await generateUniqueKey();

        const newApiKey = {
          key: apiKey,
          name: newKeyName.trim(),
          usage: 0,
        };

        apiKeyRef.child(apiKey).set(newApiKey);

        setNewKeyName('');

        toast.success('New API key created!');
      } catch (error) {
        console.log('Error generating unique key');
        toast.error('Error generating unique key');
      }
    }
  };

  const handleKeyDelete = (keyId) => {
    if (apiKeys.length > 1) {
      const database = firebase.database();
      const apiKeyRef = database.ref('Users/' + uid + '/APIKeys/' + keyId);

      apiKeyRef.remove();

      toast.success('API key deleted!');
    } else {
      toast.error('At least one API key must be present.');
    }
  };

  const handleKeyEdit = (keyId, newName) => {
    const database = firebase.database();
    const apiKeyRef = database.ref('Users/' + uid + '/APIKeys/' + keyId);

    apiKeyRef.update({ name: newName });

    toast.success('API key name updated!');
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {

      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
  };

  useEffect(() => {
    // Check if user is authenticated
    const user = firebase.auth().currentUser;
    if (!user) {
      // User not authenticated, navigate to the login page
      navigate('/login');
    }
    
  }, [navigate]);

  useEffect(() => {
    // Listen for changes in user authentication state
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        // User signed out, navigate to the login page
        navigate('/login');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);


  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Key', dataIndex: 'key', key: 'key' },
    { title: 'Usage', dataIndex: 'usage', key: 'usage' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => handleKeyDelete(record.id)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const newName = prompt('Enter a new name:');
              if (newName) {
                handleKeyEdit(record.id, newName);
              }
            }}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <h1>User Dashboard</h1>
      <h2>API Keys</h2>
      <Table
        columns={columns}
        dataSource={apiKeys}
        rowKey="id"
        pagination={false}
      />
      <div>
        <Input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
        <Button type="primary" onClick={handleNewKeySubmit}>
          Create New Key
        </Button>
      </div>
      <Button type="primary" danger onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default UserPage;

