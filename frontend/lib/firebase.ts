import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAmRQG1AZntzqkJkvjWEbmRgMYtOUa7rrY",
  authDomain: "mindsurf-4bda1.firebaseapp.com",
  projectId: "mindsurf-4bda1",
  storageBucket: "mindsurf-4bda1.firebasestorage.app",
  messagingSenderId: "394521352133",
  appId: "1:394521352133:web:753207c3eaab9acd2d5dac",
  measurementId: "G-SXZVRLTCD0"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth }; 