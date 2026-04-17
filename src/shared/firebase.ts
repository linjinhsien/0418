import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getVertexAI } from '@firebase/vertexai';

const firebaseConfig = {
  projectId: "solar-curve-490711-p4",
  appId: "1:25381047689:web:4bbef3192eb920ad912558",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "solar-curve-490711-p4.firebaseapp.com",
  storageBucket: "solar-curve-490711-p4.firebasestorage.app",
  messagingSenderId: "25381047689",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

// 使用您提供的特定 Database ID
const dbId = "ai-studio-b1efd353-fef4-4546-a539-038227947db6";
export const db = getFirestore(app, dbId);

// 初始化 Vertex AI for Firebase
export const vertexAI = getVertexAI(app);

export default app;
