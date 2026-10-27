// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
// Get your config from: https://console.firebase.google.com/project/saspsapr/settings/general
// Under "Your apps" → Web app → SDK setup and configuration → Config
//
// Also make sure to:
// 1. Enable Email/Password auth: Authentication → Sign-in method → Email/Password → Enable
// 2. Create Firestore DB: Firestore Database → Create database (start in production mode)
// 3. Firestore rules: firestore.rules in the repo root is a copy of the live ruleset. Deploy it with
//    `firebase deploy --only firestore:rules`, after comparing it with Firestore Database → Rules in the console.

import { initializeApp } from 'firebase/app'
import { getFirestore }   from 'firebase/firestore'
import { getAuth }        from 'firebase/auth'

const firebaseConfig = {
  apiKey:            "AIzaSyDbUGbnCT1Zru0UtaoxXoILMxuVL12DJUw",
  authDomain:        "saspsapr.firebaseapp.com",
  projectId:         "saspsapr",
  storageBucket:     "saspsapr.appspot.com",
  messagingSenderId: "880055273547",
  appId:             "1:880055273547:web:2bb08001f72035b89065ce",
}

const app = initializeApp(firebaseConfig)
export const db             = getFirestore(app)
export const auth           = getAuth(app)
export { firebaseConfig }
