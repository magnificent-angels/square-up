import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  apiKey: "AIzaSyDek8dKipBmCgWkCmUO-O2MeFwM1TbsQ8k",
  authDomain: "squareup-f3c0b.firebaseapp.com",
  projectId: "squareup-f3c0b",
  storageBucket: "squareup-f3c0b.appspot.com",
  messagingSenderId: "999426747082",
  appId: "1:999426747082:web:584887443725c4de40e233",
};

export const app = initializeApp(config);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
