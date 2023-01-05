import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUsernameWithUid } from "../lib/firebase";

export default function CommentCard({
    content,
    uid,
    createdAt,
}: {
    content: string;
    uid: string;
    createdAt: Timestamp;
}) {
    const [username, setUsername] = useState("boilerplate");
    const commentDate = createdAt.toDate();
    const dateString = commentDate.toLocaleString();

    useEffect(() => {
        async function updateUsername() {
            const u = await (await getUsernameWithUid(uid)).id;
            setUsername(u);
        }
        updateUsername();
    }, []);

    return (
        <div className="card">
            <p>
                Commented by <Link href={`/${username}`}>@{username}</Link> on{" "}
                {dateString}
            </p>
            <p>{content}</p>
        </div>
    );
}
