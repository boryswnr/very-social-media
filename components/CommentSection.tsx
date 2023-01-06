import { DocumentData, getFirestore } from "firebase/firestore";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../lib/firebase";
import styles from "../styles/CommentSection.module.css";
import CommentCard from "./CommentCard";

export default function CommentsSection(comments: DocumentData[]) {
    const [comment, setComment] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        setError,
    } = useForm({
        mode: "onChange",
    });

    const commentsArray = Object.values(comments);

    const addComment = async ({ content }: { content: string }) => {
        const uid = auth.currentUser.uid;
        const ref = doc(getFirestore(), "users", uid, "posts", slug);
    };

    return (
        <div>
            <h3>Comments</h3>
            {commentsArray.length > 0 ? (
                <>
                    {commentsArray.map((doc) => (
                        <CommentCard
                            key={commentsArray.indexOf(doc)}
                            content={doc.content}
                            uid={doc.uid}
                            createdAt={doc.createdAt}
                        />
                    ))}
                </>
            ) : (
                <p>No one commented yet.</p>
            )}
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
                        onChange: (e) => setComment(e.target.value),
                    })}
                ></textarea>
                {errors.content && (
                    <p className="text-danger">
                        {errors.content.message as ReactNode}
                    </p>
                )}
                <button>Add</button>
            </form>
        </div>
    );
}
function doc(arg0: any, arg1: string, uid: string, arg3: string, slug: any) {
    throw new Error("Function not implemented.");
}
