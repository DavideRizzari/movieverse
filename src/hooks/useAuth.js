import { useState, useEffect, useCallback } from 'react';
import { updateProfile, changePassword, getCollection } from '../services/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [logoutMessage, setLogoutMessage] = useState(null);

    const SESSION_TIMEOUT = 3600000; // 1 hour (closed page)
    const IDLE_TIMEOUT = 900000; // 15 minutes (open page inactivity)


    // Initial loading state
    const [loading, setLoading] = useState(true);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActive');
        setUser(null);
        setToken(null);
    }, []);

    // Check for existing session
    useEffect(() => {
        const checkSession = async () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            const lastActive = localStorage.getItem('lastActive');

            if (savedToken && savedUser) {
                // Check for timeout
                if (lastActive && Date.now() - parseInt(lastActive) > SESSION_TIMEOUT) {
                    handleLogout();
                    setLogoutMessage('Your session has expired due to inactivity. Please log in again.');
                    setLoading(false);
                    return;
                }

                // Update last active time
                localStorage.setItem('lastActive', Date.now());

                setToken(savedToken);
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error("Error parsing user data:", e);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setLoading(false);
                    return;
                }

                // Verify token by attempting to fetch collection (lightweight check)
                try {
                    await getCollection(savedToken);
                } catch (error) {
                    console.error('Session verification failed:', error);
                    if (error.message === 'Invalid or expired token' || error.message === 'Access token required') {
                        handleLogout();
                    }
                }
            }
            setLoading(false);
        };

        checkSession();
    }, [handleLogout]);

    // Idle timer
    useEffect(() => {
        let idleTimer;

        const resetIdleTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);

            // Set new timer for 15 minutes
            idleTimer = setTimeout(() => {
                if (user) {
                    handleLogout();
                    setLogoutMessage('For your security, you have been logged out after 15 minutes of inactivity.');
                }
            }, IDLE_TIMEOUT);

            // Also update localStorage for the "closed page" timeout
            const lastActive = localStorage.getItem('lastActive');
            if (!lastActive || Date.now() - parseInt(lastActive) > 60000) {
                localStorage.setItem('lastActive', Date.now());
            }
        };

        if (user) {
            resetIdleTimer();
            window.addEventListener('click', resetIdleTimer);
            window.addEventListener('keypress', resetIdleTimer);
            window.addEventListener('scroll', resetIdleTimer);
            window.addEventListener('mousemove', resetIdleTimer);
        }

        return () => {
            if (idleTimer) clearTimeout(idleTimer);
            window.removeEventListener('click', resetIdleTimer);
            window.removeEventListener('keypress', resetIdleTimer);
            window.removeEventListener('scroll', resetIdleTimer);
            window.removeEventListener('mousemove', resetIdleTimer);
        };
    }, [user, handleLogout]);

    const handleLogin = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('lastActive', Date.now());
        setLogoutMessage(null);
    };

    const handleUpdateProfile = async (profileData) => {
        const result = await updateProfile(token, profileData);
        if (result.user) {
            const updatedUser = { ...user, ...result.user };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Clear trending cache to force reload with new prefs
            localStorage.removeItem('trendingMoviesUser');
        }
    };

    const handleChangePassword = async (currentPassword, newPassword) => {
        await changePassword(token, currentPassword, newPassword);
    };

    return {
        user,
        token,
        loading,
        logoutMessage,
        setLogoutMessage,
        handleLogin,
        handleLogout,
        handleUpdateProfile,
        handleChangePassword
    };
};
