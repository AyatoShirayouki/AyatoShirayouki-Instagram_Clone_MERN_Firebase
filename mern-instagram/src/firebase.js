import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB57Sdhel8wWHlsJ_Cmp6y2pAjt-PT1KVs",
    authDomain: "instagram-clone-e8e30.firebaseapp.com",
    projectId: "instagram-clone-e8e30",
    storageBucket: "instagram-clone-e8e30.appspot.com",
    messagingSenderId: "498760977534",
    appId: "1:498760977534:web:c7bbb7f3bf735a65485c2f"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
