import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const checkAuth = useUserStore((state) => state.checkAuth);

    useEffect(() => {
        let active = true;

        (async () => {
            await checkAuth();
            if (active) navigate("/", { replace: true });
        })();

        return () => {
            active = false;
        };
    }, [checkAuth, navigate]);

    return (
        <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-foreground text-lg font-medium">Signing you in…</p>
                <p className="text-muted-foreground text-sm mt-2">Please wait while we finish Google login.</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
