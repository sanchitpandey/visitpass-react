// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZYjy8Lo_YgQ1JO9M-f7T3bnxjQ3hFxwI",
  authDomain: "visitpass-95099.firebaseapp.com",
  projectId: "visitpass-95099",
  storageBucket: "visitpass-95099.firebasestorage.app",
  messagingSenderId: "893658492996",
  appId: "1:893658492996:web:8dd2f58ec1145cd8a18c11",
  measurementId: "G-2CF1Y02QEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
