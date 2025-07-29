import firebase from "firebase/app";
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCLMHif6cuDU8xgbvBNpBHMC218KFdjueo",
  authDomain: "ninong-grab.firebaseapp.com",
  databaseURL: "https://ninong-grab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ninong-grab",
  storageBucket: "ninong-grab.appspot.com",
  messagingSenderId: "5412554287",
  appId: "1:5412554287:web:50f1642bafa175649fa8da",
  measurementId: "G-YR513ZHB3K"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore
export const auth = app.auth()

export default firebase;