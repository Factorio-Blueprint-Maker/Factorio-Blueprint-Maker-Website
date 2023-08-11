import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyDZHW1uGfE7K2yz-S5TQegMQBG8cXDGSt8",
  authDomain: "factorio-blueprint--maker.firebaseapp.com",
  databaseURL: "https://factorio-blueprint--maker-default-rtdb.firebaseio.com",
  projectId: "factorio-blueprint--maker",
  storageBucket: "factorio-blueprint--maker.appspot.com",
  messagingSenderId: "559933327660",
  appId: "1:559933327660:web:349432bbb2b8a8565d8489",
  measurementId: "G-15Y1FM8VM8"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getDatabase(app)