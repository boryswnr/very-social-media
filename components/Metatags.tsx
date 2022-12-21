import Head from "next/head";
import { type } from "os";

type MetaTagsTypes = {
    title?: string;
    description?: string;
    image?: string;
};

export default function MateTags({ title, description, image }: MetaTagsTypes) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
        </Head>
    );
}
