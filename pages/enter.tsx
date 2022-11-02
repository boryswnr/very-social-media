import {
    ChangeEvent,
    FormEvent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import debounce from "lodash.debounce";

export default function EnterPage() {
    const { user, username } = useContext(UserContext);
    console.log("user", user);
    console.log("username", username);

    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src="/google-logo.png" /> Sign in with Google
        </button>
    );
}

function SignOutButton() {
    return <button onClick={() => auth.signOut}>Sign Out</button>;
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
        if (user) {
            const userDoc = firestore.doc(`users/${user.uid}`);
            const usernameDoc = firestore.doc(`usernamesa/${formValue}`);

            const batch = firestore.batch();
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
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                setIsValid(!exists);
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

                <h3>Debug state</h3>
                <div>
                    Username: {formValue}
                    <br />
                    Loading: {loading.toString()}
                    <br />
                    Username Valid: {isValid.toString()}
                </div>
            </form>
        </section>
    );
}
