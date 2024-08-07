// AuthInitializer.js
import React, { useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext.js';

const AuthInitializer = ({ children }) => {
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            login(token); // Automatically log in with token
        }
    }, [login]);

    return <>{children}</>;
};

export default AuthInitializer;
