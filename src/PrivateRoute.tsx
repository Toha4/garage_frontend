import React from "react";
import { Navigate, useLocation } from 'react-router-dom';

import { isToken } from './services/AuthService';


interface PropType {
  component: React.FC;
}

const PrivateRoute: React.FC<PropType> = ({ component: Component }) => {
  const logged = isToken();
  const location = useLocation();

  if (!logged) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <Component />;
};

export default PrivateRoute;