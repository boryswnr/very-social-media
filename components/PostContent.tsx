import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function PostContent({ post }: { post: DocumentData }) {
    const createdAt =
        typeof post?.createdAt === "number"
            ? new Date(post.createdAt)
            : post.createdAt.toDate();

    return (
        <div className="card">
            <h1>{post?.title}</h1>
            <span className="text-sm">
                Written by{" "}
                <Link href={`/${post.username}`}>@{post.username}</Link> on{" "}
                {createdAt.toLocaleString()}
            </span>
            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}
