// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCSvYFzj3bEDaSer6hp1NZwa9vCaeUDAY",
  authDomain: "atomic-odyssey.firebaseapp.com",
  projectId: "atomic-odyssey",
  storageBucket: "atomic-odyssey.firebasestorage.app",
  messagingSenderId: "969855183693",
  appId: "1:969855183693:web:90fa6ad424d094fa25a504",
  measurementId: "G-KF26LNM7HM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)

