import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useParams } from 'react-router-dom';
import generateUniqueKey from '../../utils/firebaseUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPage = () => {
  const { uid } = useParams();
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');

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

  return (
    <div>
      <ToastContainer />
      <h1>User Dashboard</h1>
      <h2>API Keys</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Usage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id}>
              <td>{key.name}</td>
              <td>{key.key}</td>
              <td>{key.usage}</td>
              <td>
                <button onClick={() => handleKeyDelete(key.id)}>Delete</button>
                <button
                  onClick={() => {
                    const newName = prompt('Enter a new name:');
                    if (newName) {
                      handleKeyEdit(key.id, newName);
                    }
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
        <button onClick={handleNewKeySubmit}>Create New Key</button>
      </div>
    </div>
  );
};

export default UserPage;
