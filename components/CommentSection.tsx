import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/CommentSection.module.css";

export default function CommentsSection() {
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

    const addComment = async () => {};

    return (
        <div>
            <h3>Comments</h3>
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
