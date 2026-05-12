import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQ-mGIUeq7HqevdJZJ0iF-btY3DtwdVlE",
  authDomain: "zaod-earn-305fa.firebaseapp.com",
  databaseURL: "https://zaod-earn-305fa-default-rtdb.firebaseio.com",
  projectId: "zaod-earn-305fa",
  storageBucket: "zaod-earn-305fa.firebasestorage.app",
  messagingSenderId: "812952425603",
  appId: "1:812952425603:web:32ef365e3c9ce5331777b6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);