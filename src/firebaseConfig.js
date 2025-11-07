import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAW5TcVrmGHrUvMtiWHyvSMobNg8AKLitE",
  authDomain: "tyosispanel.firebaseapp.com",
  projectId: "tyosispanel",
  storageBucket: "tyosispanel.firebasestorage.app",
  messagingSenderId: "1082615656645",
  appId: "1:1082615656645:web:a7659598f5582d4de240ac"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
