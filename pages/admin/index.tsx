import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import kebabCase from "lodash.kebabcase";
import {
    collection,
    getFirestore,
    query,
    orderBy,
    doc,
    serverTimestamp,
    setDoc,
    DocumentData,
} from "firebase/firestore";
import { auth } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import { toast } from "react-hot-toast";
import PostFeed from "../../components/PostFeed";

export default function AdminPostPage({}) {
    return (
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    );
}

function PostList() {
    const ref = collection(
        getFirestore(),
        "users",
        auth.currentUser.uid,
        "posts"
    );
    const postQuery = query(ref, orderBy("createdAt"));

    const [querySnapshot] = useCollection(postQuery);

    const posts = querySnapshot?.docs.map((doc) =>
        doc.data()
    ) as DocumentData[];

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    );
}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState("");

    const slug = encodeURI(kebabCase(title));
    const isValid = title.length > 3 && title.length < 100;

    const createPost = async (e: FormEvent) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(getFirestore(), "users", uid, "posts", slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: "# hello world!",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(ref, data);

        toast.success("Post created!");

        router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My article"
                className={styles.input}
            />
            <p>
                <strong>Slug: </strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}
