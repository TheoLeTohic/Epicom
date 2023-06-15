// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  databaseURL: "https:://messenger-b5998-default-rtdb.europe-west1.firebasedatabase.app/",
  apiKey: "AIzaSyCYd1XbjBO0prC-zNdTL_Ng6djzpsJQmec",
  authDomain: "messenger-b5998.firebaseapp.com",
  projectId: "messenger-b5998",
  storageBucket: "messenger-b5998.appspot.com",
  messagingSenderId: "705157419383",
  appId: "1:705157419383:web:1bdad4a658549373cc9172"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;