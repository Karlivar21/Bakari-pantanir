// AuthInitializer.js
import React, { useEffect } from 'react';
import { registerPushNotifications } from '../utils/pushNotifications.js';

const AuthInitializer = ({ children }) => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            registerPushNotifications(token).catch(() => {});
        }
    }, []);

    return <>{children}</>;
};

export default AuthInitializer;
