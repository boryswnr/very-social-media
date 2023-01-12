import {
    query,
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    where,
    DocumentData,
} from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({
    query: urlQuery,
}: {
    query: { username: string };
}) {
    const { username } = urlQuery;

    const userDoc = await getUserWithUsername(username);

    let user: object = {};
    let posts: DocumentData[] = [];

    if (userDoc) {
        user = userDoc.data();

        const postsQuery = query(
            collection(getFirestore(), userDoc.ref.path, "posts"),
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts },
    };
}

type PropsType = {
    user: {
        displayName: string;
        photoURL: string;
        username: string;
    };
    posts: object[];
};

export default function UserProfilePage({ user, posts }: PropsType) {
    return (
        <main>
            <h1>User&apos;s page</h1>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}
