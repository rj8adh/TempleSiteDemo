import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite.js'; // Adjust this import to point to your appwrite.js file

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Grab the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');

        if (userId && secret) {
            // 2. Finalize the session manually on your own domain
            account.createSession(userId, secret)
                .then(() => {
                    // Success! Send them to the homepage or dashboard
                    navigate('/'); 
                })
                .catch((error) => {
                    console.error('Session creation failed:', error);
                    navigate('/login?error=session_failed');
                });
        } else {
            // If they land here without tokens, kick them back to login
            navigate('/login?error=missing_credentials');
        }
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <p>Logging you in...</p>
        </div>
    );
};

export default AuthCallback;
