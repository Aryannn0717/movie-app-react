// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChOyKG-R54ln665870IR6Civazp0zXW74",
  authDomain: "school-project-aa252.firebaseapp.com",
  projectId: "school-project-aa252",
  storageBucket: "school-project-aa252.firebasestorage.app",
  messagingSenderId: "448947706230",
  appId: "1:448947706230:web:a1e125781e3a41ad5ac257",
  measurementId: "G-FQKS9VKYT0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };