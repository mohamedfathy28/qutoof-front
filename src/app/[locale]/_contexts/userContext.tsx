"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our user data
interface UserState {
    id: number;
    image: string;
    username: string;
    full_name: string;
    email: string;
    country_code: string;
    phone: string;
    country_code_2: string;
    phone_2: string;
    country_code_whatsapp: string;
    whatsapp_number: string;
    emergency_number_country_code: string;
    emergency_number: string;
    active: number;
    bank_name: string;
    bank_account_number: string;
    isntapay_account: string;
    national_id: string;
    national_id_image: string;
    nationality: string;
    created_at: string;
}

// Define the context value type
interface UserContextType {
    user: UserState;
    loading: boolean;
    updateUser: (userData: Partial<UserState>) => void;
}



// Create the context with the correct type
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook for using the user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserState>(() => {
        try {
            const savedUser = typeof window !== 'undefined' && localStorage.getItem('userInfo');
            return savedUser ? JSON.parse(savedUser) : undefined;
        } catch (error) {
            console.error('Error parsing user info from localStorage:', error);
            return undefined;
        }
    });
    const [loading, setLoading] = useState(true);

    // Function to update user data
    const updateUser = (userData: Partial<UserState>) => {
        setUser(prevUser => ({
            ...prevUser,
            ...userData
        }));
    };

    // Effect to load user data on mount
    useEffect(() => {
        const initializeUser = async () => {
            try {
                // Add your initialization logic here
                // e.g., check local storage, validate token, fetch user data
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to initialize user:', error);
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    // Create the context value object
    const contextValue: UserContextType = {
        user,
        loading,
        updateUser
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};