// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyAcFU1m9l_3JOhhoplOQ0n3yc1vREPfa_g",

  authDomain: "atomic-odyssey-3d061.firebaseapp.com",

  projectId: "atomic-odyssey-3d061",

  storageBucket: "atomic-odyssey-3d061.firebasestorage.app",

  messagingSenderId: "367395546369",

  appId: "1:367395546369:web:367a2b129880422d1fe700",

  measurementId: "G-EE9EXPERTJ"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)

