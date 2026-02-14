import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

 const firebaseConfig = {
    apiKey: "AIzaSyDFZrzFCsqVq4FUKB1onpkHR70cYh3ZCPA",
    authDomain: "waultdot-design.firebaseapp.com",
    projectId: "waultdot-design",
    storageBucket: "waultdot-design.firebasestorage.app",
    messagingSenderId: "508816172974",
    appId: "1:508816172974:web:6482af561fb2daffd98a3f",
    measurementId: "G-6G89N8B72Q"
  };


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
