// IMPORTANT: Make sure your Firebase Config is correct
const firebaseConfig = {
    apiKey: "AIzaSyCV2IrYyrDuvwo0KrDkErYU5jQzF_Ay33A",
    authDomain: "web-course-ba01f.firebaseapp.com",
    databaseURL: "https://web-course-ba01f-default-rtdb.firebaseio.com",
    projectId: "web-course-ba01f",
    storageBucket: "web-course-ba01f.appspot.com",
    messagingSenderId: "395157922720",
    appId: "1:395157922720:web:fa0377e2de141de9d03ac5",
    measurementId: "G-ZVJ6VDD0CQ"
};

// Initialize Firebase ONCE and ONLY ONCE
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Create a reference to FIRESTORE to be used by other scripts
const firestore = firebase.firestore();