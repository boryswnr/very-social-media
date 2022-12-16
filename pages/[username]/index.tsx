import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);
    let user: object = {};
    let posts: any[] = [];

    if (userDoc) {
        user = userDoc.data();
        const postsQuery = userDoc.ref
            .collection("posts")
            .where("published", "==", true)
            .orderBy("createdAt", "desc")
            .limit(5);

        posts = (await postsQuery.get()).docs.map(postToJSON);
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
