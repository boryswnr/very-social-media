import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import toast from "react-hot-toast";

export default function Home() {
    return (
        <>
            <h1>Welcome to Kolektyff</h1>
            <h3>Because it's SOCIAL media. Get it?</h3>
            <button onClick={() => toast.success("hello toast!")}>
                Toast Me
            </button>
        </>
    );
}
