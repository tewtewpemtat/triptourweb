import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore"; // เพิ่ม getDoc และ deleteDoc
import { getStorage } from "firebase/storage"; // เพิ่ม getStorage
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgzISmUfbwWBHyrqyyma9AQQ_Tctimlt4",
  authDomain: "triptour-63a6f.firebaseapp.com",
  databaseURL: "https://triptour-63a6f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "triptour-63a6f",
  storageBucket: "triptour-63a6f.appspot.com",
  messagingSenderId: "371074619895",
  appId: "1:371074619895:web:5590b21af5d5da2e67f6f2",
  measurementId: "G-743V1Q921X"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app); 
const storage = getStorage(app); // เพิ่มการเข้าถึง Firebase Storage
const auth = getAuth(app);
export { app, analytics, storage,firestore, doc, getDoc, deleteDoc,auth }; // เพิ่มฟังก์ชัน doc, getDoc และ deleteDoc
