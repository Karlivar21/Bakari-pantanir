// AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');

    const login = (authToken) => {
        setToken(authToken);
        setIsLoggedIn(true);
        localStorage.setItem('token', authToken); // Store token in local storage
    };

    const logout = () => {
        setToken('');
        setIsLoggedIn(false);
        localStorage.removeItem('token'); // Remove token from local storage
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
