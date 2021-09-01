import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSSaFWksbhygv_BoI7ZcgVykbqnniCQr4",
  authDomain: "whatsapp-22.firebaseapp.com",
  projectId: "whatsapp-22",
  storageBucket: "whatsapp-22.appspot.com",
  messagingSenderId: "430456967675",
  appId: "1:430456967675:web:7629f8fec86dbafbe7fb5e",
  measurementId: "G-B1F6JCD9XT",
};

const firebaseApp = !firebase.apps.length
  ? initializeApp(firebaseConfig)
  : firebase.app();

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
