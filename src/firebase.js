import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvQv-4byFlb07S5ZsX4CFda73C9mrOh5Y",
  authDomain: "smartscouts-fa7ba.firebaseapp.com",
  projectId: "smartscouts-fa7ba",
  storageBucket: "smartscouts-fa7ba.appspot.com",
  messagingSenderId: "708143836020",
  appId: "1:708143836020:web:4bcd3500186a6935ca5a21",
  measurementId: "G-93S19FMLPS",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebaseConfig.auth();
export default firebase;
