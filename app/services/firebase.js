import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAcmUfQt8slLzm1b8t2FrXzIqoObZQ1hjQ",
    authDomain: "nextlog-32b37.firebaseapp.com",
    projectId: "nextlog-32b37",
    storageBucket: "nextlog-32b37.firebasestorage.app",
    messagingSenderId: "206225531722",
    appId: "1:206225531722:web:fb7fa158a4739bc4fd97b3",
    measurementId: "G-006GGSDL62"
};

// Prevent re-initialization during Next.js hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
// Safe Analytics initialization for SSR environment
let analytics = null;
if (typeof window !== 'undefined') {
    // isSupported() handles environments where cookies/indexing are disabled
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}
export { app, analytics, db, storage, auth };
