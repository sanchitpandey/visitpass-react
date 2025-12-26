// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAugxhpgCmw0gnXSqVEZsRMcZj060Vozdo",
  authDomain: "visitpass-8c15b.firebaseapp.com",
  projectId: "visitpass-8c15b",
  storageBucket: "visitpass-8c15b.firebasestorage.app",
  messagingSenderId: "907296408556",
  appId: "1:907296408556:web:82665628cf8e7d88ac36c9",
  measurementId: "G-6GL7G5S39Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
