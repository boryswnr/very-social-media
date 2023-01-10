import {
    ChangeEvent,
    FormEvent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider } from "../lib/firebase";
import debounce from "lodash.debounce";
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";

export default function EnterPage() {
    const { user, username } = useContext(UserContext);

    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <>
                        <h2>Hello {username}!</h2>
                        <SignOutButton />
                    </>
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image
                src="/google-logo.png"
                alt="google logo"
                width={30}
                height={30}
            />{" "}
            Sign in with Google
        </button>
    );
}

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, username } = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = (e.target as HTMLInputElement).value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user && user.uid) {
            const userDoc = doc(getFirestore(), "users", user.uid);
            const usernameDoc = doc(getFirestore(), "usernames", formValue);

            const batch = writeBatch(getFirestore());
            batch.set(userDoc, {
                username: formValue,
                photoURL: user.photoURL,
                displayName: user.displayName,
            });
            batch.set(usernameDoc, { uid: user.uid });

            await batch.commit();
        }
    };

    const checkUsername = useCallback(
        debounce(async (username: string) => {
            if (username.length >= 3) {
                const ref = doc(getFirestore(), `usernames`, username);
                const snap = await getDoc(ref);
                setIsValid(!snap.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    function UserNameMessage({
        username,
        isValid,
        loading,
    }: {
        username: string;
        isValid: boolean;
        loading: boolean;
    }) {
        if (loading) {
            return <p>Checking...</p>;
        } else if (isValid) {
            return <p className="text-success">{username} is available!</p>;
        } else if (username && !isValid) {
            return <p className="text-danger">That username is taken!</p>;
        } else {
            return <p></p>;
        }
    }

    return (
        <section>
            <h3>Choose username</h3>
            <form onSubmit={(e) => onSubmit(e)}>
                <input
                    name="username"
                    placeholder="username"
                    value={formValue}
                    onChange={(e) => onChange(e)}
                />
                <UserNameMessage
                    username={formValue}
                    isValid={isValid}
                    loading={loading}
                />
                <button type="submit" className="btn-green" disabled={!isValid}>
                    Choose
                </button>
            </form>
        </section>
    );
}
