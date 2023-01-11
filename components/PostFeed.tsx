import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import React from "react";

export default function PostFeed({
    posts,
    admin,
}: {
    posts: DocumentData[];
    admin?: boolean;
}) {
    return posts ? (
        <>
            {posts.map((post) => (
                <PostItem post={post} key={post.slug} admin={admin} />
            ))}
        </>
    ) : (
        <></>
    );
}

function PostItem({
    post,
    admin = false,
}: {
    post: DocumentData;
    admin?: boolean;
}) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <strong>By @{post.username}</strong>
            </Link>

            <Link href={`/${post.username}/${post.slug}`}>
                <h2>{post.title}</h2>
            </Link>

            <footer>
                <span>
                    {wordCount} words. {minutesToRead} min read
                </span>
                <span>💖 {post.heartCount} Hearts</span>
            </footer>

            {admin && (
                <>
                    <Link href={`/admin/${post.slug}`}>
                        <h3>
                            <button className="btn-blue">Edit</button>
                        </h3>
                    </Link>

                    {post.published ? (
                        <p className="text-success">Live</p>
                    ) : (
                        <p className="text-danger">Unpublished</p>
                    )}
                </>
            )}
        </div>
    );
}
