// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBzAqIQVCXyHGxkH2e5-7ulzJqNuLrk0GI",

  authDomain: "testing-e09eb.firebaseapp.com",

  projectId: "testing-e09eb",

  storageBucket: "testing-e09eb.appspot.com",

  messagingSenderId: "1041925136393",

  appId: "1:1041925136393:web:0e2cdecc1b43d4bc1dd8d8",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
