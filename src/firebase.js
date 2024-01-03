import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  apiKey: "AIzaSyDek8dKipBmCgWkCmUO-O2MeFwM1TbsQ8k",
  authDomain: "squareup-f3c0b.firebaseapp.com",
  projectId: "squareup-f3c0b",
  storageBucket: "squareup-f3c0b.appspot.com",
  messagingSenderId: "999426747082",
  appId: "1:999426747082:web:584887443725c4de40e233"
};

export let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(config);
    auth = initializeAuth(app);

    // Set up AsyncStorage as the persistence provider
    const persistenceKey = "myApp:persistence";
    await AsyncStorage.setItem(persistenceKey, "1");
    await getAuth(app).setPersistence(auth.Persistence.LOCAL);
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

export const database = getFirestore(app);