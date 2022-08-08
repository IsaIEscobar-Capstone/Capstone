import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const app = initializeApp({
  apiKey: 'AIzaSyBNh-2J1L5EOSM17Ivrjgrv1LJSwJS0EUE',
  authDomain: 'journey-23f29.firebaseapp.com',
  projectId: 'journey-23f29',
  storageBucket: 'journey-23f29.appspot.com',
  messagingSenderId: '422612556440',
  appId: '1:;422612556440:web:f41113c40ee433b07c8eed',
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
