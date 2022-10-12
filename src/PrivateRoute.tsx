import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { isToken, IUser } from "./services/AuthService";
import { UserProvider } from "./helpers/UserContext";

interface PropType {
  component: React.FC;
  user: IUser | null;
}

const PrivateRoute: React.FC<PropType> = ({ component: Component, user }) => {
  const logged = isToken();
  const location = useLocation();

  if (!logged) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return (
    <UserProvider value={user}>
      <Component />
    </UserProvider>
  );
};

export default PrivateRoute;
