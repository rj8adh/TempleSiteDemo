import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Loader2, UserPlus, Flame } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import logo from "../assets/logo.png"

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

// commment
// force deploy



const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const { signup, loading } = useUserStore();

    const set = (field) => (e) => setFormData((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
    };

    return (
        <div className="min-h-screen bg-parchment flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-sm">

                {/* Logo mark */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="bg-white rounded-lg flex items-center justify-center h-12 w-16 sm:h-14 sm:w-20 p-0.75 shadow-sm overflow-hidden">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-[110%] w-full object-contain scale-125"
                            />
                        </div>
                        <p className="font-heading text-xl font-bold text-foreground tracking-tight">
                            Pashupatinath US
                        </p>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-card ring-1 ring-border rounded-2xl shadow-sm px-8 py-8 space-y-6">

                    {/* Heading */}
                    <div className="text-center space-y-1">
                        <h1 className="font-heading text-3xl font-bold text-foreground leading-tight">
                            Join Our Community
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create your account to book blessings and services.
                        </p>
                    </div>

                    {/* Google button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2.5 rounded-xl h-10"
                        onClick={useUserStore.getState().loginWithGoogle}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">
                            or
                        </span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    className="pl-9 h-10"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={set("name")}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    className="pl-9 h-10"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={set("email")}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="pl-9 h-10"
                                    placeholder="Min. 6 characters"
                                    value={formData.password}
                                    onChange={set("password")}
                                />
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    className="pl-9 h-10"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={set("confirmPassword")}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full gap-2 rounded-xl h-11 text-sm font-semibold mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                            ) : (
                                <><UserPlus size={15} /> Create Account</>
                            )}
                        </Button>
                    </form>

                    {/* Footer link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-primary font-medium hover:underline underline-offset-4"
                        >
                            Sign in →
                        </Link>
                    </p>
                </div>

                {/* Fine print */}
                <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <span className="underline underline-offset-4 cursor-pointer">Terms</span>{" "}
                    and{" "}
                    <span className="underline underline-offset-4 cursor-pointer">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
