import Image from "next/image";
import React from "react";

export default function UserProfile({ user }) {
    return (
        <div className="box-center">
            <Image
                src={user.photoURL}
                alt="avatar picture of the profile you are visiting"
                className="card-img-center"
                width={150}
                height={150}
            />
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1>
        </div>
    );
}
