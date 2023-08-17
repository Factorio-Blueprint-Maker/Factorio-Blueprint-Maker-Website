import React from 'react';
import { useAuth } from '../Context/authContext.js';
import { useNavigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return children;
  } else {
    navigate('/explore');
    return null;
  }
};
export default AuthRoute;