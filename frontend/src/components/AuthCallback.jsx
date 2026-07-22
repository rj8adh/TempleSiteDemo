import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite.js'; // Adjust if needed
import { useUserStore } from '../stores/useUserStore.js'; // MUST UPDATE TO YOUR ACTUAL PATH

const AuthCallback = () => {
    const navigate = useNavigate();
    // 1. Pull the checkAuth function from your Zustand store
    const checkAuth = useUserStore((state) => state.checkAuth);
    const hasRun = useRef(false);

    useEffect(() => {
        // Prevent React strict mode double-firing
        if (hasRun.current) return;
        hasRun.current = true;

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');

        if (userId && secret) {
            // 2. Consume the token to create the browser session
            account.createSession(userId, secret)
                .then(async () => {
                    // 3. Force Zustand to update the global user state!
                    await checkAuth();
                    
                    // 4. Finally, push the user into the app
                    navigate('/'); 
                })
                .catch((error) => {
                    console.error('Session creation failed:', error);
                    navigate('/login?error=session_failed');
                });
        } else {
            navigate('/login?error=missing_credentials');
        }
    }, [navigate, checkAuth]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <p>Finalizing login...</p>
        </div>
    );
};

export default AuthCallback;
