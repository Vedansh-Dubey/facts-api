import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import generateUniqueKey from '../../utils/firebaseUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Popconfirm, Popover } from 'antd';
import { DeleteOutlined, EditOutlined, CopyOutlined, LogoutOutlined } from '@ant-design/icons';
import "./userPage.css";
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
      if (newKeyName.trim().length > 12) {
        toast.error('API key name should not exceed 12 characters');
        return;
      }

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
    if (newName.trim().length > 12) {
      toast.error('API key name should not exceed 12 characters');
      return;
    }

    const database = firebase.database();
    const apiKeyRef = database.ref('Users/' + uid + '/APIKeys/' + keyId);

    apiKeyRef.update({ name: newName });

    toast.success('API key name updated!');
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {})
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

  const handleKeyCopy = (key) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (text) => (
        <Space>
          <span>{text}</span>
          <Popover title="Copy to clipboard">
          <CopyOutlined
            onClick={() => handleKeyCopy(text)}
            style={{ cursor: 'pointer', color: "grey", fontSize: "17px" }}
          />
          </Popover>
        </Space>
      ),
    },
    { title: 'Usage', dataIndex: 'usage', key: 'usage' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete the key"
            description="Are you sure to delete this API Key?"
            onConfirm={() => handleKeyDelete(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<DeleteOutlined />}
          >
          <DeleteOutlined style={{ cursor: "pointer", color: "red", fontSize: "18px", padding:"10px" }} danger />
          </Popconfirm>
          <EditOutlined
            style={{ cursor: "pointer", color: "blue", fontSize: "18px", padding:"10px" }}
            onClick={() => {
              const newName = prompt('Enter a new name:');
              if (newName) {
                handleKeyEdit(record.id, newName);
              }
            }}
          />

        </Space>
      ),
    },
  ];

  return (
    <div className="user-page">
      <ToastContainer />
      <h1 className="dashboard-heading">WELCOME !!</h1>
      <h2 className="api-keys-heading">Your API Keys</h2>
      <Table
        className="api-keys-table"
        columns={columns}
        dataSource={apiKeys}
        rowKey="id"
        pagination={{
          pageSize: 3,

        }}
        scroll={{
          y: 300,
          x: 650,          
        }}
      />
      <div className="new-key-form">
        <Input
        placeholder='Enter new key name'
          className="key-input"
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
         <Popover title="Generate a new key with the given name." content={<p>The usage of the following key would also be consumed from total Quota</p>}>
        <Button
          className="create-key-button"
          type="primary"
          onClick={handleNewKeySubmit}
        >
          Create New Key
        </Button>
        </Popover>
      </div>
      <Popconfirm
      title="Are you sure"
      description="You would be logged out of the current session"
      onConfirm={()=> handleLogout()}
      okText="Yes"
      cancelText="No"
      icon={<LogoutOutlined />}
      >
      <Button
        className="logout-button"
        type="primary"
        danger
        icon={<LogoutOutlined/>}
      >
        Logout
      </Button>
      </Popconfirm>
    </div>
  );
};

export default UserPage;
