import { Context, createContext } from "react";

type UserObjectType = {
    uid: string | null;
    photoURL: string | null;
    displayName: string | null;
};

type ContextTypes = {
    user: UserObjectType | null | undefined;
    username: null | string | undefined;
};

export const UserContext = createContext<ContextTypes>({
    user: null,
    username: null,
});
