import {
    deleteDoc,
    doc,
    DocumentData,
    DocumentReference,
    getFirestore,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import AuthCheck from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
import Loader from "../../components/Loader";
import { Overlay } from "../../components/Overlay";
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
    const [getConfirmation, setGetConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { slug } = router.query;
    let userId = "null";
    if (auth.currentUser) {
        userId = auth.currentUser.uid;
    }
    const postRef = doc(
        getFirestore(),
        "users",
        userId,
        "posts",
        slug as string
    );
    const [post] = useDocumentData(postRef);

    const deletePost = async () => {
        await deleteDoc(postRef);
        router.push("/admin");
        toast.error("Post deleted");
    };

    const liveView = (post: DocumentData) => {
        setLoading(true);
        router.push(`/${post.username}/${post.slug}`);
    };

    return (
        <main className={styles.container}>
            {getConfirmation && (
                <Overlay>
                    <p>Are you sure you want to delete this post?</p>
                    <button className="btn-blue" onClick={() => deletePost()}>
                        Yes, delete it.
                    </button>
                    <button
                        className="btn-red"
                        onClick={() => setGetConfirmation(false)}
                    >
                        No, I changed my mind.
                    </button>
                </Overlay>
            )}
            {post && (
                <>
                    <section>
                        <Loader show={loading} />
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
                        <button
                            onClick={() => liveView(post)}
                            className="btn-blue"
                        >
                            Live view
                        </button>
                        <button
                            onClick={() => setGetConfirmation(true)}
                            className="btn-red"
                        >
                            Delete post
                        </button>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({
    defaultValues,
    postRef,
    preview,
}: {
    defaultValues: DocumentData;
    postRef: DocumentReference<DocumentData>;
    preview: boolean;
}) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues,
        mode: "onChange",
    });

    const updatePost = async ({ content, published }: DocumentData) => {
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
                <ImageUploader />

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
