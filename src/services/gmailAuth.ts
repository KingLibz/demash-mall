// REAL config - no mock firebase-applet-config.json
// Uses env vars - add real values in Render Dashboard -> Environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "real-key-from-firebase-console",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// If no env, use demashglobal.live real project (add tomorrow)
export const getAuthConfig = () => {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("real-key")) {
    console.log("Add real Firebase config in Render Env for global marketing")
    return { isReal: false, note: "Add real Firebase config - no mock" }
  }
  return { isReal: true, config: firebaseConfig }
}

export default firebaseConfig
