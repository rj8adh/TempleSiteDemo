import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "./components/ui/sonner";

import AuthCallback from './components/AuthCallback';
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import ServicesPage from "./pages/ServicesPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import OrderHistoryPage from "./pages/OrderHistoryPage"
import AboutPage from "./pages/AboutPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import LearnMorePage from "./pages/LearnMorePage";
import ArticlePage from "./pages/ArticlePage"
import FamilyPage from "./pages/FamilyPage"
import PrivacyPage from "./pages/PrivacyPage";
import SettingsPage from "./pages/SettingsPage";
import TermsPage from "./pages/TermsPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();

    // 1. Verify session cookie on mount (runs exactly once)
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (checkingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-parchment">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-background text-foreground relative'>
            <Navbar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
                <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
                <Route path='/auth/callback' element={<AuthCallbackPage />} />
                <Route
                    path='/secret-dashboard'
                    element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
                />
                <Route path='/services' element={<ServicesPage />} />
                <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
                <Route
                    path='/purchase-success'
                    element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
                />
                <Route
                    path='/purchase-cancel'
                    element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />}
                />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path='/orders' element={user ? <OrderHistoryPage /> : <Navigate to='/login' />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/events' element={<EventsPage />} />
                <Route path='/contact' element={<ContactPage />} />
                <Route path='/learn-more' element={<LearnMorePage />} />
                <Route path='/learn-more/:slug' element={<ArticlePage />} />
                <Route path='/my-family' element={user ? <FamilyPage /> : <Navigate to='/login' />} />
                <Route path='/privacy-policy' element={<PrivacyPage />} />
                <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to='/login' />} />
                <Route path='/terms-of-service' element={<TermsPage />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
            <Footer />
            <Toaster position='top-center' reverseOrder={false} />
            <SonnerToaster richColors />
        </div>
    );
}

export default App;
