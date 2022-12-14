import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FormEvent, useState } from "react";
import { auth, STATE_CHANGED, storage } from "../lib/firebase";
import Loader from "./Loader";

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState("");

    const uploadFile = async (e) => {
        const file = Array.from(e.target.files)[0] as Blob;
        const extension = file.type.split("/")[1];
        const fileRef = ref(
            storage,
            `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
        );
        setUploading(true);

        const task = uploadBytesResumable(fileRef, file);
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                100
            ).toFixed(0);
            setProgress(+pct);

            task.then((d) => getDownloadURL(fileRef)).then((url) => {
                setDownloadURL(url as string);
                setUploading(false);
            });
        });
    };

    return (
        <div className="box">
            <Loader show={uploading} />
            {uploading && <h3>{progress}%</h3>}
            {!uploading && (
                <>
                    <label className="btn">
                        Upload Img
                        <input
                            type="file"
                            onChange={uploadFile}
                            accept="image/x-png,image/gif,image/jpeg"
                        />
                    </label>
                </>
            )}

            {downloadURL && (
                <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
            )}
        </div>
    );
}
