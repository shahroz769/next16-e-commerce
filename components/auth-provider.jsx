'use client';

import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, currentUser }) => {
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
