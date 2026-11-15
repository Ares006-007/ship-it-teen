import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8i28x1eXbDJrEoMNYs4oO7x1vKimxavE",
  authDomain: "shipit-teen.firebaseapp.com",
  projectId: "shipit-teen",
  storageBucket: "shipit-teen.firebasestorage.app",
  messagingSenderId: "711360015632",
  appId: "1:711360015632:web:a7b02dd72395e4ed484995",
  measurementId: "G-RSNBJ5J7FG"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Only initialize analytics on the client side
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, storage, auth, db, googleProvider };
