import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import toast from "react-hot-toast";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import { useEffect, useState } from "react";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";

const LIMIT = 1;

export const fetchCache = "no-store";

async function getPosts() {
    const postsQuery = firestore
        .collectionGroup("posts")
        .where("published", "==", true)
        .orderBy("craetedAt", "desc")
        .limit(LIMIT);

    const posts = (await postsQuery.get()).docs.map(postToJSON);

    return posts;
}

export default function Home() {
    const props = getPosts();
    const [posts, setPosts] = useState(props);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor =
            typeof last.createdAt === "number"
                ? fromMillis(last.CreatedAt)
                : last.createdAt;

        const query = firestore
            .collectionGroup("posts")
            .where("published", "==", true)
            .orderBy("createdAt", "desc")
            .startAfter(cursor)
            .limit(LIMIT);

        const newPosts = (await query.get()).docs.map((doc) => doc.data());

        setPosts(posts.concat(newPosts));

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
