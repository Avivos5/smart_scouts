import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth"
import "firebase/compat/storage"
import 'firebase/compat/database'
import { getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage"

const app = firebase.initializeApp({
  apiKey: "AIzaSyBvQv-4byFlb07S5ZsX4CFda73C9mrOh5Y",
  authDomain: "smartscouts-fa7ba.firebaseapp.com",
  projectId: "smartscouts-fa7ba",
  storageBucket: "smartscouts-fa7ba.appspot.com",
  messagingSenderId: "708143836020",
  appId: "1:708143836020:web:4bcd3500186a6935ca5a21",
  measurementId: "G-93S19FMLPS",
});

export const auth = app.auth()
export const db = getFirestore(app)
export const storage = getStorage(app);
export default firebase;
