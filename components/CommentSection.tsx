import { DocumentData } from "firebase/firestore";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/CommentSection.module.css";
import CommentCard from "./CommentCard";

export default function CommentsSection(comments: DocumentData[]) {
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

    console.log("comments:", comments);
    console.log("commentsArray:", commentsArray);
    // console.log("comments.keys:", Object.values(comments).length);
    // console.log("comments.length:", comments.length);
    // console.log("typeof comments:", typeof comments);

    const addComment = async () => {};

    return (
        <div>
            <h3>Comments</h3>
            {commentsArray.length > 0 ? (
                <>
                    {commentsArray.map((doc) => (
                        <CommentCard key={commentsArray.indexOf(doc)} content={doc.content} />
                    ))}
                </>
            ) : (
                <p>No one commented yet.</p>
            )}
            <form onSubmit={handleSubmit(addComment)}>
                <textarea
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
                            message: "content is required",
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
        </div>
    );
}
