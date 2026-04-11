// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
// Get your config from: https://console.firebase.google.com/project/saspsapr/settings/general
// Under "Your apps" → Web app → SDK setup and configuration → Config
//
// Also make sure to:
// 1. Enable Email/Password auth: Authentication → Sign-in method → Email/Password → Enable
// 2. Create Firestore DB: Firestore Database → Create database (start in production mode)
// 3. Set Firestore rules (Firestore Database → Rules):
//
//      rules_version = '2';
//      service cloud.firestore {
//        match /databases/{database}/documents {
//          match /fishing_evidence/{doc} {
//            allow read: if true;
//            allow write: if request.auth != null;
//          }
//          match /sapr_mdt/{doc} {
//            allow read: if true;
//            allow write: if request.auth != null;
//          }
//          match /sapr_users/{doc} {
//            allow read: if true;
//            allow write: if request.auth != null;
//          }
//          match /sapr_user_secrets/{doc} {
//            allow read, write: if request.auth != null
//              && request.auth.token.email in [
//                'sapr@anubhav.gg',
//                'eddiebrock@sapr.gg'
//              ];
//          }
//          match /sapr_applications/{doc} {
//            allow create: if true;
//            allow read, update, delete: if request.auth != null;
//          }
//          match /sapr_config/{doc} {
//            allow read: if true;
//            allow write: if request.auth != null
//              && request.auth.token.email in [
//                'sapr@anubhav.gg',
//                'eddiebrock@sapr.gg'
//              ];
//          }
//        }
//      }

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
