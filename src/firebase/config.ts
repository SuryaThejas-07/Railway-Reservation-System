import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUoIANRyeadaRQkoKxjPitSsArSoNph60",
  authDomain: "railway-reservation-e7952.firebaseapp.com",
  projectId: "railway-reservation-e7952",
  storageBucket: "railway-reservation-e7952.firebasestorage.app",
  messagingSenderId: "1070720792406",
  appId: "1:1070720792406:web:b50a8ced5bb5003bd1c8f7",
  measurementId: "G-8QGCY26G4F",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
