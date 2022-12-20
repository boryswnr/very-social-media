// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import "firebase/compat/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
    getFirestore,
    collection,
    where,
    getDocs,
    query,
    limit,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDNG9vWAU8I9mXanlnOBZLNuhWaVQMXgBk",
    authDomain: "kolektyff.firebaseapp.com",
    projectId: "kolektyff",
    storageBucket: "kolektyff.appspot.com",
    messagingSenderId: "614837199511",
    appId: "1:614837199511:web:7d3871b22a2c165b987fd2",
    measurementId: "G-Y6DDHB2P8V",
};

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

function createFirebaseApp(config) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);

// export const auth = firebase.auth();
// export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// export const firestore = firebase.firestore();
// export const storage = firebase.storage();
// export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const firestore = getFirestore(firebaseApp);

export async function getUserWithUsername(username: string) {
    // const usersRef = firestore.collection("users");
    // const query = usersRef.where("username", "==", username).limit(1);
    const q = query(
        collection(firestore, "users"),
        where("username", "==", username),
        limit(1)
    );

    const userDoc = (await getDocs(q)).docs[0];
    return userDoc;
}

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis() || 0,
        updatedAt: data.updatedAt.toMillis() || 0,
    };
}
