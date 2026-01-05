import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyChcZSvXs0PKPSM3VAEjJXLWWA1YXIRtDM",
  authDomain: "sbrmaintenanceapp182a.firebaseapp.com",
  projectId: "sbrmaintenanceapp182a",
  storageBucket: "sbrmaintenanceapp182a.firebasestorage.app",
  messagingSenderId: "37100512950",
  appId: "1:37100512950:web:56599b7eb56f100f586817"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);