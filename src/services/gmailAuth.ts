import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"

// REAL Firebase config - from Render Env vars (add real tomorrow)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key-add-real-in-render-env",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demash-core.onrender.com.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demash-core.onrender.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

// REQUIRED EXPORTS - fixes Build failed
export const initAuth = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback)
}

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    return { user: result.user, isReal: true }
  } catch (e: any) {
    console.log("Add real Firebase config in Render Env for global marketing")
    return { user: null, isReal: false, error: e.message }
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export const getAuthConfig = () => {
  return { isReal: !firebaseConfig.apiKey.includes("demo-key"), config: firebaseConfig }
}

export default firebaseConfig
