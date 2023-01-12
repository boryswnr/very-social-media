import {
    addDoc,
    collection,
    DocumentData,
    getFirestore,
    serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";
import { ReactNode } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../lib/firebase";
import styles from "../styles/CommentSection.module.css";
import AuthCheck from "./AuthCheck";
import CommentCard from "./CommentCard";

export default function CommentsSection({
    comments,
    path,
}: {
    comments: DocumentData[];
    path: string;
}) {
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    // potentially TODO: get an actual postRef here. Then again, this works
    const pathSplit = path.split("/");
    const postSlug = pathSplit[pathSplit.length - 1];
    const authorSlug = pathSplit[1];

    const addComment: SubmitHandler<FieldValues> = async ({ content }) => {
        if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            const ref = collection(
                getFirestore(),
                "users",
                authorSlug,
                "posts",
                postSlug,
                "comments"
            );

            const data = {
                content,
                uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(ref, data);
            resetField("content");
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            {comments && comments.length > 0 ? (
                <>
                    {comments.map((item) => (
                        <CommentCard
                            key={comments.indexOf(item)}
                            content={item.content}
                            uid={item.uid}
                            createdAt={item.createdAt}
                        />
                    ))}
                </>
            ) : (
                <p>No one commented yet.</p>
            )}
            <AuthCheck
                fallback={
                    <Link href="/enter">
                        <button>Sign Up to comment</button>
                    </Link>
                }
            >
                <h5>Add your comment.</h5>
                <form onSubmit={handleSubmit(addComment)}>
                    <textarea
                        placeholder="What do you want to say?"
                        className={styles.input}
                        {...register("content", {
                            minLength: {
                                value: 10,
                                message: "content is too short",
                            },
                            maxLength: {
                                value: 1600,
                                message: "content is too long",
                            },
                            required: {
                                value: true,
                                message: "you can't add empty comment",
                            },
                        })}
                    ></textarea>
                    {errors.content && (
                        <p className="text-danger">
                            {errors.content.message as ReactNode}
                        </p>
                    )}
                    <button>Add</button>
                </form>
            </AuthCheck>
        </div>
    );
}
