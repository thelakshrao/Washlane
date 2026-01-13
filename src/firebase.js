import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnoXMmcQUkdcWwBR9usfzMzIXDTxdw1V0",
  authDomain: "washlanelogin.firebaseapp.com",
  projectId: "washlanelogin",
  storageBucket: "washlanelogin.firebasestorage.app",
  messagingSenderId: "988744518400",
  appId: "1:988744518400:web:29fb76f6c66760d7fd81e5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
export default app;