import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // Your Firebase config
};

export const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig);
  
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  if (!__DEV__) {
    getAnalytics(app);
  }

  return app;
};

export const auth = getAuth(); 