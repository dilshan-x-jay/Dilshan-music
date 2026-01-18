
import { initializeApp } from "firebase/app";
// Using standard imports for Firebase auth
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVo7ZJPyGGzKo3uvL1b-8_LxcUF_bFjJw",
  authDomain: "dilshan-music.firebaseapp.com",
  projectId: "dilshan-music",
  storageBucket: "dilshan-music.firebasestorage.app",
  messagingSenderId: "951537513307",
  appId: "1:951537513307:web:a4a343c2a07e087e57207e",
  measurementId: "G-4V6D51CNDE"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
