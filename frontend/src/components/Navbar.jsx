import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, LogOut, LogIn, UserPlus, Lock, History, Users, Settings } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "../assets/logo.png"

const Navbar = () => {
    const { user, logout } = useUserStore();
    const { cart, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isAdmin = user?.role === "admin";
    const cartCount = Array.isArray(cart) 
    ? cart.reduce((acc, item) => acc + item.quantity, 0) 
    : 0;

    const handleLogout = () => {
        logout();
        clearCart();
        navigate("/login");
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-primary shadow-md shadow-primary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

                    {/* ── Brand ── */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="bg-white rounded-lg flex items-center justify-center h-12 w-16 sm:h-14 sm:w-20 p-0.75 shadow-sm overflow-hidden">
                            <img src={logo} alt="Logo" className="h-[110%] w-full object-contain scale-125" />
                        </div>
                        <span className="font-heading text-lg font-bold text-white leading-none hidden sm:block">
                            Pashupatinath US
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => cn(
                                    "text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
                                    isActive ? "text-white underline underline-offset-4" : "text-white/80 hover:text-white"
                                )}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* ── Desktop Actions (Fixed with Labels) ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {user ? (
                            <>
                                <Link to="/orders" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                    <History size={18} />
                                    <span className="text-xs font-medium hidden lg:block">History</span>
                                </Link>
                                
                                <Link to="/my-family" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                    <Users size={18} />
                                    <span className="text-xs font-medium hidden lg:block">Family</span>
                                </Link>

                                <Link to="/cart" className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                    <ShoppingBag size={18} />
                                    <span className="text-xs font-medium hidden lg:block">Cart</span>
                                    {cartCount > 0 && (
                                        <span className="bg-white text-primary text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {isAdmin && (
                                    <Link to="/secret-dashboard" className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-white/20 text-white border border-white/30 ml-1">
                                        <Lock size={12} /> Admin
                                    </Link>
                                )}

                                <Separator orientation="vertical" className="h-5 mx-2 bg-white/20" />

                                <Link to="/settings" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                    <Settings size={18} />
                                    <span className="text-xs font-medium hidden lg:block">Settings</span>
                                </Link>

                                <Link to="/profile" className="flex items-center gap-2 px-2 text-white/90 hover:text-white">
                                    <div className="bg-white/20 rounded-full p-1"><User size={14} /></div>
                                    <span className="text-sm font-medium hidden lg:block">{user?.name?.split(" ")[0] || "User"}</span>
                                </Link>

                                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1.5">
                                    <LogOut size={14} /> Sign Out
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium px-3">Sign In</Link>
                                <Link to="/signup" className="bg-white text-primary text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-white/90">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex md:hidden">
                        <button onClick={() => setDrawerOpen(true)} className="p-1.5 text-white"><Menu size={24} /></button>
                    </div>
                </div>
            </nav>

            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} isAdmin={isAdmin} cartCount={cartCount} onLogout={handleLogout} />
        </>
    );
};

// ... keep NAV_LINKS and MobileDrawer exactly as they were ...
const NAV_LINKS = [
    { to: "/about",      label: "About"    },
    { to: "/services",   label: "Services" },
    { to: "/events",     label: "Events"   },
    { to: "/learn-more", label: "Learn"    },
    { to: "/contact",    label: "Contact & Donate"  },
];

function MobileDrawer({ open, onClose, user, isAdmin, cartCount, onLogout }) {
    const close = () => onClose();
    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent side="right" className="w-72 flex flex-col p-0">
                <SheetHeader className="px-5 pt-5 pb-4 border-b">
                    <SheetTitle asChild>
                        <Link to="/" onClick={close} className="flex items-center gap-2">
                            <div className="bg-white rounded-lg p-1 h-10 w-14 overflow-hidden border">
                                <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                            </div>
                            <span className="font-heading text-base font-bold">Pashupatinath US</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {NAV_LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} onClick={close} className="flex py-2.5 px-3 text-sm font-medium hover:bg-muted rounded-lg">{link.label}</NavLink>
                    ))}
                    {user && (
                        <>
                            <Separator className="my-2" />
                            <NavLink to="/cart" onClick={close} className="flex items-center gap-3 py-2.5 px-3 text-sm hover:bg-muted rounded-lg"><ShoppingBag size={16}/> Cart ({cartCount})</NavLink>
                            <NavLink to="/orders" onClick={close} className="flex items-center gap-3 py-2.5 px-3 text-sm hover:bg-muted rounded-lg"><History size={16}/> My Offerings</NavLink>
                            <NavLink to="/my-family" onClick={close} className="flex items-center gap-3 py-2.5 px-3 text-sm hover:bg-muted rounded-lg"><Users size={16}/> Family Circle</NavLink>
                            <NavLink to="/settings" onClick={close} className="flex items-center gap-3 py-2.5 px-3 text-sm hover:bg-muted rounded-lg"><Settings size={16}/> Settings</NavLink>
                        </>
                    )}
                </nav>
                <div className="p-4 border-t space-y-2">
                    {user ? (
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { onLogout(); close(); }}>
                            <LogOut size={16} /> Sign Out
                        </Button>
                    ) : (
                        <>
                            <Link to="/login" onClick={close} className="flex w-full h-9 items-center justify-center border rounded-lg text-sm font-medium">Sign In</Link>
                            <Link to="/signup" onClick={close} className="flex w-full h-9 items-center justify-center bg-primary text-white rounded-lg text-sm font-bold">Sign Up</Link>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default Navbar;