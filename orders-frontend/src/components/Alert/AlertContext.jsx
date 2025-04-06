import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback((message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => {
            setAlert(null);
        }, 3000); // auto-hide after 3 seconds
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert && <Alert message={alert.message} type={alert.type} />}
        </AlertContext.Provider>
    );
};

const Alert = ({ message, type }) => {
    const background = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${background} text-white font-bold py-3 px-6 rounded-xl shadow-lg z-50 animate-slide-down`}>
            {message}
        </div>
    );
};
