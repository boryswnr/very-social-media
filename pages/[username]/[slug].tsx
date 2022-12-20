import {
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    query,
} from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const postRef = doc(getFirestore(), userDoc.ref.path, "posts", slug);
        post = postToJSON(await getDoc(postRef));

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    };
}

export async function getStaticPaths() {
    const q = query(collectionGroup(getFirestore(), "posts"), limit(20));
    const snapshot = await getDocs(q);

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        paths,
        fallback: "blocking",
    };
}

export default function Post(props) {
    return (
        <main>
            <h1>User's post page</h1>
        </main>
    );
}
