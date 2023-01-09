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
    const [dateStamp, setDateStamp] = useState("");
    let commentDate: Date;
    let dateString = "";

    useEffect(() => {
        async function updateUsername() {
            const u = await (await getUsernameWithUid(uid)).id;
            setUsername(u);
        }
        updateUsername();
        if (createdAt) {
            commentDate = createdAt.toDate();
            setDateStamp(commentDate.toLocaleString());
        }
    }, [createdAt]);

    return (
        <div className="card">
            <p className="text-sm">
                Commented by <Link href={`/${username}`}>@{username}</Link> on{" "}
                {dateStamp}:
            </p>
            <p>{content}</p>
        </div>
    );
}
