// PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element, ...props }) => {
    const { isLoggedIn } = useContext(AuthContext);

    return isLoggedIn ? (
        <Route {...props} element={element} />
    ) : (
        <Navigate to="/signin" />
    );
};

export default PrivateRoute;
