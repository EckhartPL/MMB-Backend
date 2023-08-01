import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC10FzYgs92zUvWX9ZE4IePO0FyiQvJpUg',
  authDomain: 'mmb-storage.firebaseapp.com',
  projectId: 'mmb-storage',
  storageBucket: 'mmb-storage.appspot.com',
  messagingSenderId: '1023481221930',
  appId: '1:1023481221930:web:d01fb750672b3c1891c453',
  measurementId: 'G-21NGH15MQK',
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
