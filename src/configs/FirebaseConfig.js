// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu1Ufb9VFXUfCULJbJxuo3kPTnfIxe0BM",
  authDomain: "tofis-app.firebaseapp.com",
  databaseURL: "https://tofis-app-default-rtdb.firebaseio.com",
  projectId: "tofis-app",
  storageBucket: "tofis-app.firebasestorage.app",
  messagingSenderId: "920947549661",
  appId: "1:920947549661:web:9f940b70bd52d4934d4234"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getDatabase(app);