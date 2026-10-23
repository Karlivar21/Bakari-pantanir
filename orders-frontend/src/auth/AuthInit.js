// AuthInitializer.js
import React, { useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext.js';
import { registerPushNotifications } from '../utils/pushNotifications.js';

const AuthInitializer = ({ children }) => {
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            login(token);
            registerPushNotifications(token).catch(() => {});
        }
    }, []);

    return <>{children}</>;
};

export default AuthInitializer;
