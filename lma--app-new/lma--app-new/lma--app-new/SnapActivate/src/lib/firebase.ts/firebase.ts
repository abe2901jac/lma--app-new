// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "snapactivate",
  appId: "1:778962723161:web:b92fae615e57a0a9a12c48",
  storageBucket: "snapactivate.appspot.com",
  apiKey: "AIzaSyD5W83WGeu18r2ewIbkxf7ydAAAr_e9828",
  authDomain: "snapactivate.firebaseapp.com",
  messagingSenderId: "778962723161"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };