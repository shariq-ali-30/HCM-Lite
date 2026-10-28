import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUUDtV6N-7Us_k8vzIKqwBbex3eQriEoM",
  authDomain: "hcm-lite-fc05c.firebaseapp.com",
  projectId: "hcm-lite-fc05c",
  storageBucket: "hcm-lite-fc05c.firebasestorage.app",
  messagingSenderId: "246097907044",
  appId: "1:246097907044:web:6a1fc8f32125a3a86cfe71",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore()