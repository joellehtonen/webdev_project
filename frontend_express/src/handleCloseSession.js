import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutOnClose = (handleLogout) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeUnload = () => {
            handleLogout('closing')
        };

        // Add event listener when component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [handleLogout, navigate]);
};

export default LogoutOnClose;
