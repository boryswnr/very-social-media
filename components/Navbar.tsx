import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

const blankAvatarUrl =
    "https://apsec.iafor.org/wp-content/uploads/sites/37/2017/02/IAFOR-Blank-Avatar-Image.jpg";

export default function Navbar() {
    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">COLLECTIVE</button>
                    </Link>
                </li>
                {/* if user is signed in */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue">
                                    Write Posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img
                                    src={
                                        user?.photoURL
                                            ? user?.photoURL
                                            : blankAvatarUrl
                                    }
                                />
                            </Link>
                        </li>
                    </>
                )}

                {/* if user is not signed in or has not created a username */}
                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
