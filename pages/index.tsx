import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import toast from "react-hot-toast";
import { firestore, postToJSON } from "../lib/firebase";
import {
    Timestamp,
    query,
    where,
    orderBy,
    limit,
    collectionGroup,
    getDocs,
    startAfter,
    getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";

const LIMIT = 10;

export async function getServerSideProps(context) {
    const ref = collectionGroup(getFirestore(), "posts");
    const postsQuery = query(
        ref,
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(LIMIT)
    );

    const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

    return {
        props: { posts },
    };
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor =
            typeof last.createdAt === "number"
                ? Timestamp.fromMillis(last.createdAt)
                : last.createdAt;

        const ref = collectionGroup(getFirestore(), "posts");
        const postsQuery = query(
            ref,
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(cursor),
            limit(LIMIT)
        );

        const newPosts = (await getDocs(postsQuery)).docs.map((doc) =>
            doc.data()
        );

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

    return (
        <main>
            <PostFeed posts={posts} />

            {!loading && !postsEnd && (
                <button onClick={getMorePosts}>Load more</button>
            )}
            <Loader show={loading} />

            {postsEnd && "You have reached the end!"}
        </main>
    );
}
