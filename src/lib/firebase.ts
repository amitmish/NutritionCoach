import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config from the console
const firebaseConfig = {
    apiKey: "AIzaSyBfQbNnJKYSa1KttXqK4G6MsSsFrZukWO0",
    authDomain: "nutrisnap-59353.firebaseapp.com",
    projectId: "nutrisnap-59353",
    storageBucket: "nutrisnap-59353.firebasestorage.app",
    messagingSenderId: "676947608164",
    appId: "1:676947608164:web:b6933e0e4db7ca775f1571",
    measurementId: "G-QXM2M9DB2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);
