// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCuVYizOx8NlKeF-kgU2i2SFzzBAic7L94",
    authDomain: "whatsapp---mit.firebaseapp.com",
    projectId: "whatsapp---mit",
    storageBucket: "whatsapp---mit.appspot.com",
    messagingSenderId: "290237482744",
    appId: "1:290237482744:web:fc1c2db973ddfac9dd5d0d",
    measurementId: "G-ZCWZNG3T22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };