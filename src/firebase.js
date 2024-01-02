import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDek8dKipBmCgWkCmUO-O2MeFwM1TbsQ8k",
  authDomain: "squareup-f3c0b.firebaseapp.com",
  projectId: "squareup-f3c0b",
  storageBucket: "squareup-f3c0b.appspot.com",
  messagingSenderId: "999426747082",
  appId: "1:999426747082:web:584887443725c4de40e233"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
