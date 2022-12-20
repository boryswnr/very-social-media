import {
    query,
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    where,
} from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query: urlQuery }) {
    const { username } = urlQuery;
    console.log("username:", username);

    const userDoc = await getUserWithUsername(username);

    let user: object = {};
    let posts: any[] = [];

    if (userDoc) {
        console.log("true");

        user = userDoc.data();

        const postsQuery = query(
            collection(getFirestore(), userDoc.ref.path, "posts"),
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
        console.log("posts in users page", posts);
    }

    return {
        props: { user, posts },
    };
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <h1>User's page</h1>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}
