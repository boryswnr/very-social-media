import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDNG9vWAU8I9mXanlnOBZLNuhWaVQMXgBk",
    authDomain: "kolektyff.firebaseapp.com",
    projectId: "kolektyff",
    storageBucket: "kolektyff.appspot.com",
    messagingSenderId: "614837199511",
    appId: "1:614837199511:web:7d3871b22a2c165b987fd2",
    measurementId: "G-Y6DDHB2P8V",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
