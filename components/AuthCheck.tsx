import Link from "next/link";
import { ReactElement, useContext } from "react";
import { UserContext } from "../lib/context";

export default function AuthCheck(props: {
    children: ReactElement[];
    fallback?: any;
}) {
    const { username } = useContext(UserContext);

    return username
        ? props.children
        : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
