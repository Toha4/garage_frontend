import React from "react";
import { IUser } from "../services/AuthService";

const UserContext = React.createContext<IUser | null | undefined>(undefined);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;