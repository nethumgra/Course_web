import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVu0_PvOOA_1D1Dk0La4Gy-X_dlrq5n4s",
    authDomain: "mindinu-vege.firebaseapp.com",
    projectId: "mindinu-vege",
    storageBucket: "mindinu-vege.appspot.com",
    messagingSenderId: "122155864706",
    appId: "1:122155864706:web:42f6c6aff06b3aeb779a9b",
    measurementId: "G-8X3DYYXF2K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);