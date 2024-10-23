import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InactivityLogout = (isLoggedIn, handleLogout, timeoutDuration = 600000) => {
    const navigate = useNavigate();

    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            if (isLoggedIn) {
                // Automatically log out after 10 minutes of inactivity (600000 ms)
                timeoutId = setTimeout(() => {
                    handleLogout('inactivity');
                }, timeoutDuration);
            }
        };

        // Listen to events that reset the inactivity timer
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);

        resetTimer()

        // Clean up listeners and timer when component unmounts or user logs out
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, [isLoggedIn, handleLogout, timeoutDuration, navigate]);
};

export default InactivityLogout;
