import {
    doc,
    getFirestore,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import {
    useDocumentData,
    useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import AuthCheck from "../../components/AuthCheck";
import { auth } from "../../lib/firebase";
import styles from "../../styles/Admin.module.css";

export default function AdminPostEdit({}) {
    return (
        <main>
            <AuthCheck>
                <PostManager />
            </AuthCheck>
        </main>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);
    const router = useRouter();
    const { slug } = router.query;

    const postRef = doc(
        getFirestore(),
        "users",
        auth.currentUser.uid,
        "posts",
        slug as string
    );
    const [post] = useDocumentData(postRef);
    console.log(post);

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                        />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? "Edit" : "Preview"}
                        </button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues,
        mode: "onChange",
    });

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success("Post updated successfully!");
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch("content")}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <textarea
                    {...register("content", {
                        minLength: {
                            value: 10,
                            message: "content is too short",
                        },
                        maxLength: {
                            value: 20000,
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
                <fieldset>
                    <input
                        className={styles.checkbox}
                        type="checkbox"
                        {...register("published")}
                    />
                    <label>Published</label>
                </fieldset>

                <button
                    className="btn-green"
                    type="submit"
                    disabled={errors.content ? true : false}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
