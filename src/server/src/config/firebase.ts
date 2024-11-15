import * as admin from 'firebase-admin';
import { FIREBASE_SERVICE_ACCOUNT } from './environment';

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT)
});

export default admin; 