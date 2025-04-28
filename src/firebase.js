// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAspbyevmoTiDZ4AVSGKab1vJWr24CJFlA",
    authDomain: "quiz-ad0fb.firebaseapp.com",
    databaseURL: "https://quiz-ad0fb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quiz-ad0fb",
    storageBucket: "quiz-ad0fb.firebasestorage.app",
    messagingSenderId: "69395220213",
    appId: "1:69395220213:web:c8cfe8e19b092eb9b6e7bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app; 