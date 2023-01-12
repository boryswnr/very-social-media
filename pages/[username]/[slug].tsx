import styles from "../../styles/Post.module.css";
import {
    collection,
    collectionGroup,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
} from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import Heart from "../../components/HeartButton";
import Link from "next/link";
import CommentsSection from "../../components/CommentSection";

type ParamsType = {
    params: {
        username: string;
        slug: string;
    };
};

export async function getStaticProps({ params }: ParamsType) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post: DocumentData = {};
    let path = "";

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

type propsType = { post: DocumentData; path: string };

export default function Post(props: propsType) {
    const postRef = doc(getFirestore(), props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    const commentsRef = collection(getFirestore(), props.path, "comments");

    const commentsQuery = query(commentsRef, orderBy("createdAt"));
    const [querySnapshot] = useCollection(commentsQuery);

    const comments = querySnapshot?.docs.map((doc) =>
        doc.data()
    ) as DocumentData[];

    return (
        <>
            <main>
                <div className={styles.container}>
                    <section>
                        <PostContent post={post} />
                    </section>
                    <aside className="card">
                        <p>
                            <strong>{post.heartCount || 0} 💖</strong>
                        </p>
                        <AuthCheck
                            fallback={
                                <Link href="/enter">
                                    <button>💖 Sign Up</button>
                                </Link>
                            }
                        >
                            <Heart postRef={postRef} />
                        </AuthCheck>
                    </aside>
                </div>
                <CommentsSection comments={comments} path={props.path} />
            </main>
        </>
    );
}
