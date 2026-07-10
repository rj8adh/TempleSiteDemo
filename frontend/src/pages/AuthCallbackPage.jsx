import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useUserStore();

  useEffect(() => {
    let active = true;

    const finishAuth = async () => {
      try {
        await checkAuth();
        if (!active) return;

        const next = searchParams.get("next");
        navigate(next || "/", { replace: true });
      } catch {
        if (!active) return;
        navigate("/login?error=oauth_callback_failed", { replace: true });
      }
    };

    finishAuth();

    return () => {
      active = false;
    };
  }, [checkAuth, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
    </div>
  );
};

export default AuthCallbackPage;
