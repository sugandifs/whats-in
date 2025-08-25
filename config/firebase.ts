// Import the functions you need from the SDKs you need
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_APIKEY,
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTHDOMAIN,
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECTID,
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGEBUCKET,
  messagingSenderId:
    Constants.expoConfig?.extra?.FIREBASE_MESSAGINGSENDERID,
  appId: Constants.expoConfig?.extra?.FIREBASE_APPID,
  measurementId: Constants.expoConfig?.extra?.FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
let auth: Auth;
try {
  // Try to get existing auth instance
  auth = getAuth(app);
} catch (error) {
  // If that fails, initialize auth
  auth = initializeAuth(app);
}

const db = getFirestore(app);

export { auth, db };
