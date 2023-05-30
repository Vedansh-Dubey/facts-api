import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { v4 as uuidv4 } from 'uuid';

const generateUniqueKey = () => {
  return new Promise((resolve, reject) => {
    const apiKey = uuidv4();
    const database = firebase.database();
    const apiKeysRef = database.ref('APIKeys');
    apiKeysRef
      .orderByChild('key')
      .equalTo(apiKey)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(generateUniqueKey());
        } else {
          resolve(apiKey);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default generateUniqueKey;
