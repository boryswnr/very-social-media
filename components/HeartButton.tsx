import {
    doc,
    getFirestore,
    increment,
    writeBatch,
    DocumentReference,
    DocumentData,
} from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth } from "../lib/firebase";

type postRefType = {
    postRef: DocumentReference<DocumentData>;
};

export default function Heart({ postRef }: postRefType) {
    let userId = "null";
    if (auth.currentUser) {
        userId = auth.currentUser.uid;
    }

    const heartRef = doc(getFirestore(), postRef.path, "hearts", userId);

    const [heartDoc] = useDocument(heartRef);

    const addHeart = async () => {
        const uid = userId;
        const batch = writeBatch(getFirestore());

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartRef, { uid });

        await batch.commit();
    };

    const removeHeart = async () => {
        const batch = writeBatch(getFirestore());

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    };

    // the method must be called
    return heartDoc?.exists() ? (
        <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
        <button onClick={addHeart}>💖 Heart</button>
    );
}
