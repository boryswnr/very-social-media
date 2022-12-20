import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";

export function useUserData() {
    const [user] = useAuthState(auth as any);
    const [username, setUsername] = useState<null | string | undefined>(null);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            // const ref = firestore.collection("users").doc(user.uid);
            const ref = doc(getFirestore(), "users", user.uid);
            unsubscribe = onSnapshot(ref, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username };
}
