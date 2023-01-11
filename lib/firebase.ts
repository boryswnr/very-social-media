import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
    getFirestore,
    collection,
    where,
    getDocs,
    query,
    limit,
    DocumentSnapshot,
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

type configTypes = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};

function createFirebaseApp(config: configTypes) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(firebaseApp);

export async function getUserWithUsername(username: string) {
    const q = query(
        collection(firestore, "users"),
        where("username", "==", username),
        limit(1)
    );

    const userDoc = (await getDocs(q)).docs[0];
    return userDoc;
}

export async function getUsernameWithUid(uid: string) {
    const q = query(
        collection(firestore, "usernames"),
        where("uid", "==", uid),
        limit(1)
    );

    const usernameDoc = (await getDocs(q)).docs[0];
    return usernameDoc;
}

export function postToJSON(doc: DocumentSnapshot) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    };
}

export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = "state_changed";
