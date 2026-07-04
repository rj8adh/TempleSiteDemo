import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingCart, Trash2, Plus, Minus, ShoppingBag,
    User, UserPlus, Check, Cake, Loader2, Users, Sparkles, Phone
} from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react"


// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1597040663342-45b326432694?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573407947257-f4eb2c5fe8a0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
];

function getServiceImage(product, index) {
    return product.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function formatPrice(price) {
    if (price == null) return null;
    return `$${Number(price).toLocaleString("en-IN")}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortBirthday(dateVal) {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function memberSublabel(m) {
    const parts = [m.relationship || null, shortBirthday(m.birthday)].filter(Boolean);
    return parts.join(" · ") || undefined;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col rounded-xl overflow-hidden ring-1 ring-foreground/10 bg-card">
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="px-4 py-4 space-y-3">
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-7 w-28 rounded-lg" />
                        <Skeleton className="h-8 w-full rounded-xl mt-1" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Radio option ─────────────────────────────────────────────────────────────
// A single recipient choice styled as a selectable row.

function RecipientOption({ value, selected, onSelect, icon: Icon, label, sublabel }) {
    const isActive = selected === value;
    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
                "w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                    ? "border-primary bg-primary/8 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
            )}
        >
            {/* Leading icon */}
            <div className={cn(
                "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
                <Icon size={14} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className={cn(
                    "text-sm font-medium leading-none",
                    isActive ? "text-primary" : "text-foreground"
                )}>
                    {label}
                </p>
                {sublabel && (
                    <p className="text-[11px] text-muted-foreground mt-1 leading-none">{sublabel}</p>
                )}
            </div>

            {/* Check indicator */}
            <div className={cn(
                "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                isActive ? "border-primary bg-primary" : "border-muted-foreground/30 bg-transparent"
            )}>
                {isActive && <Check size={10} className="text-primary-foreground stroke-[3]" />}
            </div>
        </button>
    );
}

// ─── Blessing-For Dialog ──────────────────────────────────────────────────────

function BlessingForDialog({ product, productIndex, open, onClose, onConfirm }) {
    const { user, fetchFamilyMembers, addFamilyMember } = useUserStore();
    const family = user?.family ?? [];

    const [selected,      setSelected]      = useState(null);
    const [customName,    setCustomName]    = useState("");
    const [customBday,    setCustomBday]    = useState("");
    const [saveToFamily,  setSaveToFamily]  = useState(false);
    const [confirming,    setConfirming]    = useState(false);

    // Always fetch fresh family data when the dialog opens
    useEffect(() => {
        if (open) fetchFamilyMembers();
    }, [open, fetchFamilyMembers]);

    const reset = () => {
        setSelected(null);
        setCustomName("");
        setCustomBday("");
        setSaveToFamily(false);
        setConfirming(false);
    };

    const handleOpenChange = (v) => {
        if (!v) { reset(); onClose(); }
    };

    const showNewPersonFields = selected === "new_person";
    const customNameMissing   = showNewPersonFields && customName.trim().length === 0;
    const isValid             = selected !== null && (!showNewPersonFields || customName.trim().length > 0);
    // Only offer "save" when they've actually typed a name
    const canSave             = showNewPersonFields && customName.trim().length > 0;

    const handleConfirm = async () => {
        if (!isValid || confirming) return;
        setConfirming(true);
    
        try {
            let recipient = null;
    
            if (selected === "myself") {
                // ── Myself ────────────────────────────────────────────────────
                recipient = {
                    name:     user?.name     ?? "Myself",
                    birthday: user?.birthday ?? null,
                    // Pulling ritual details from the main user profile
                    gotra:    user?.gotra    ?? "",
                    rashi:    user?.rashi    ?? "",
                };
    
            } else if (selected === "new_person") {
                // ── New person ────────────────────────────────────────────────
                const nameVal = customName.trim();
                const bdayVal = customBday || null;
    
                if (saveToFamily) {
                    // Step 1: Save to DB
                    const saved = await addFamilyMember({
                        name:         nameVal,
                        birthday:     bdayVal,
                        relationship: "",
                    });
    
                    if (!saved) {
                        setConfirming(false);
                        return; 
                    }
    
                    // Step 2: Use server-confirmed data
                    recipient = {
                        name:     saved.name,
                        birthday: saved.birthday ?? null,
                        gotra:    saved.gotra    ?? "",
                        rashi:    saved.rashi    ?? "",
                    };
                } else {
                    // User chose not to save — use typed values, initialize empty ritual strings
                    recipient = { 
                        name: nameVal, 
                        birthday: bdayVal, 
                        gotra: "", 
                        rashi: "" 
                    };
                }
    
            } else {
                // ── Existing saved family member ──────────────────────────────
                const member = family.find((m) => m._id === selected);
                if (!member) {
                    toast.error("That family member could not be found. Please select again.");
                    setConfirming(false);
                    return;
                }
                
                // Pulling ritual details from the specific family member object
                recipient = { 
                    name: member.name, 
                    birthday: member.birthday ?? null,
                    gotra: member.gotra ?? "",
                    rashi: member.rashi ?? ""
                };
            }
    
            // All paths succeeded — proceed to cart with full details
            onConfirm(recipient);
            reset();
        } catch (err) {
            console.error("BlessingForDialog confirm error:", err);
            toast.error("Something went wrong. Please try again.");
            setConfirming(false);
        }
    };

    if (!product) return null;

    const img = getServiceImage(product, productIndex);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden gap-0">

                {/* ── Service banner ── */}
                <div className="relative h-28 overflow-hidden shrink-0">
                    <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = FALLBACK_IMAGES[0]; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                        <p className="font-heading text-white font-bold text-lg leading-tight line-clamp-1">
                            {product.name}
                        </p>
                        {product.price != null && (
                            <span className="shrink-0 text-sm font-bold text-white bg-primary/90 px-2.5 py-1 rounded-lg">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Scrollable body ── */}
                <div className="px-5 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

                    {/* Header */}
                    <DialogHeader className="p-0">
                        <DialogTitle className="font-heading text-xl font-bold text-foreground text-left leading-snug">
                            Who is this blessing for?
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The priest will dedicate this puja on behalf of the chosen person.
                        </p>
                    </DialogHeader>

                    {/* ── Recipient list ── */}
                    <div className="space-y-2">

                        {/* Myself */}
                        <RecipientOption
                            value="myself"
                            selected={selected}
                            onSelect={setSelected}
                            icon={User}
                            label={user?.name ?? "Myself"}
                            sublabel={
                                user?.birthday
                                    ? `Me · ${shortBirthday(user.birthday)}`
                                    : "Me"
                            }
                        />

                        {/* Saved family members */}
                        {family.map((m) => (
                            <RecipientOption
                                key={m._id}
                                value={m._id}
                                selected={selected}
                                onSelect={setSelected}
                                icon={UserPlus}
                                label={m.name}
                                sublabel={memberSublabel(m)}
                            />
                        ))}

                        {/* Add new person */}
                        <RecipientOption
                            value="new_person"
                            selected={selected}
                            onSelect={setSelected}
                            icon={Users}
                            label="Add new person…"
                            sublabel="Enter their name and birthday below"
                        />
                    </div>

                    {/* ── New person form ── */}
                    {showNewPersonFields && (
                        <div className="space-y-4 pt-1 border-t border-border">

                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="bf-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Full Name{" "}
                                    <span className="text-destructive normal-case font-normal tracking-normal">*</span>
                                </Label>
                                <Input
                                    id="bf-name"
                                    placeholder="e.g. Ram Bahadur"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    className={cn(customNameMissing && "ring-1 ring-destructive focus-visible:ring-destructive")}
                                    autoFocus
                                />
                                {customNameMissing && (
                                    <p className="text-[11px] text-destructive">Name is required to continue.</p>
                                )}
                            </div>

                            {/* Birthday */}
                            <div className="space-y-1.5">
                                <Label htmlFor="bf-bday" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Date of Birth{" "}
                                    <span className="normal-case font-normal tracking-normal text-muted-foreground">(optional)</span>
                                </Label>
                                <div className="relative">
                                    <Cake size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="bf-bday"
                                        type="date"
                                        value={customBday}
                                        onChange={(e) => setCustomBday(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]}
                                        className="pl-9"
                                    />
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Helps the priest personalise the ceremony.
                                </p>
                            </div>

                            {/* Save-to-family toggle — only shown once a name is typed */}
                            {canSave && (
                                <>
                                    <Separator />
                                    <button
                                        type="button"
                                        onClick={() => setSaveToFamily((v) => !v)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all duration-150",
                                            saveToFamily
                                                ? "border-primary/40 bg-primary/5 ring-1 ring-primary/30"
                                                : "border-border hover:border-primary/30 hover:bg-muted/30"
                                        )}
                                    >
                                        {/* Checkbox */}
                                        <div className={cn(
                                            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                                            saveToFamily
                                                ? "bg-primary border-primary"
                                                : "border-muted-foreground/35"
                                        )}>
                                            {saveToFamily && (
                                                <Check size={10} className="text-primary-foreground stroke-[3]" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-medium leading-none",
                                                saveToFamily ? "text-primary" : "text-foreground"
                                            )}>
                                                Save to my Family Circle
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                Remember {customName.trim()} for future bookings
                                            </p>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── No family yet — subtle nudge ── */}
                    {family.length === 0 && selected !== "new_person" && (
                        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                            Save time next time —{" "}
                            <Link
                                to="/my-family"
                                className="text-primary underline underline-offset-2 hover:text-primary/80"
                                onClick={() => { reset(); onClose(); }}
                            >
                                add family members
                            </Link>{" "}
                            to your profile.
                        </p>
                    )}

                    {/* ── Confirm CTA ── */}
                    <Button
                        className="w-full gap-2 rounded-xl h-11 font-semibold"
                        disabled={!isValid || confirming}
                        onClick={handleConfirm}
                    >
                        {confirming ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                {saveToFamily ? "Saving & Adding…" : "Adding…"}
                            </>
                        ) : isValid ? (
                            <>
                                <ShoppingCart size={15} />
                                Add to Cart
                            </>
                        ) : (
                            "Select a recipient to continue"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ product, index, onAddToCart }) {
    return (
        <Card className="card-glow h-full flex flex-col hover:ring-primary/40 ring-1 ring-border">
            <div className="aspect-video w-full overflow-hidden relative">
                <img
                    src={getServiceImage(product, index)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    onError={(e) => { e.target.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]; }}
                />
            </div>

            <CardHeader className="pt-4">
                {product.category && (
                    <Badge variant="outline" className="w-fit border-primary/50 text-primary">
                        {product.category}
                    </Badge>
                )}
                <CardTitle className="text-base leading-snug line-clamp-2">
                    {product.name}
                </CardTitle>
                <CardDescription className="text-sm">
                    {product.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 mt-auto space-y-3">
                {product.price != null && (
                    <p className="text-2xl font-bold text-primary tracking-tight">
                        {formatPrice(product.price)}
                    </p>
                )}
                <Button
                    className="w-full gap-2 rounded-xl"
                    onClick={() => onAddToCart(product, index)}
                >
                    <ShoppingCart size={15} />
                    Add to Cart
                </Button>
            </CardContent>
        </Card>
    );
}

// ─── Cart Sheet ───────────────────────────────────────────────────────────────

function CartSheet({ open, onOpenChange }) {
    const { cart: rawCart, subtotal, removeFromCart, updateQuantity } = useCartStore();
    const navigate = useNavigate();
    const cart = Array.isArray(rawCart) ? rawCart : [];

    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2 text-lg">
                        <ShoppingBag size={18} className="text-primary" />
                        Your Cart
                        {itemCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground ml-1">{itemCount}</Badge>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 gap-3 text-center">
                            <ShoppingBag size={40} className="text-muted-foreground/40" />
                            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
                            <p className="text-muted-foreground/60 text-xs">Add a service to begin your booking.</p>
                        </div>
                    ) : (
                        cart.map((item) => {
                            const cid = item.cartItemId ?? item._id;
                            return (
                                <div
                                    key={cid}
                                    className="flex gap-3 items-start py-3 border-b border-border last:border-0"
                                >
                                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                                        <img
                                            src={item.image || FALLBACK_IMAGES[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                                        {item.recipient?.name && (
                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                For: <span className="font-medium text-foreground">{item.recipient.name}</span>
                                            </p>
                                        )}
                                        <p className="text-sm font-bold text-primary mt-0.5">{formatPrice(item.price)}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(cid, item.quantity - 1)}
                                                className="w-6 h-6 rounded-md ring-1 ring-border flex items-center justify-center hover:bg-muted transition-colors"
                                            >
                                                <Minus size={11} />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(cid, item.quantity + 1)}
                                                className="w-6 h-6 rounded-md ring-1 ring-border flex items-center justify-center hover:bg-muted transition-colors"
                                            >
                                                <Plus size={11} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <p className="text-sm font-semibold text-foreground">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(cid)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {cart.length > 0 && (
                    <SheetFooter className="px-5 pt-4 border-t border-border">
                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <span className="text-lg font-bold text-foreground">{formatPrice(subtotal)}</span>
                            </div>
                            <Button
                                className="w-full gap-2 rounded-xl h-10"
                                onClick={() => { onOpenChange(false); navigate("/cart"); }}
                            >
                                Proceed to Checkout
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                Taxes and fees calculated at checkout
                            </p>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}

// ─── Service Grid ─────────────────────────────────────────────────────────────

function ServiceGrid({ products, onAddToCart }) {
    if (products.length === 0) {
        return (
            <p className="text-center text-muted-foreground py-24">
                No services available at this time.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
                <ServiceCard
                    key={product._id}
                    product={product}
                    index={index}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ServicesPage = () => {
    const { products, fetchAllProducts, loading } = useProductStore();
    const { addToCart } = useCartStore();
    const { user } = useUserStore();

    const [cartOpen, setCartOpen]           = useState(false);
    const [dialogOpen, setDialogOpen]       = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);
    const [pendingIndex, setPendingIndex]   = useState(0);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    // Step 1: clicking "Add to Cart" on a card opens the recipient dialog
    const handleAddToCart = (product, index) => {
        if (!user) {
            toast.error("Please log in to book a service");
            return;
        }
        setPendingProduct(product);
        setPendingIndex(index);
        setDialogOpen(true);
    };

    // Step 2: user confirmed a recipient — store it with the cart item
    const handleDialogConfirm = async (recipient) => {
        setDialogOpen(false);
        if (!pendingProduct) return;

        // Pass recipient so it is embedded in the cart item in the Zustand store.
        // This means CartPage can read it directly from item.recipient without
        // asking the user to re-select.
        await addToCart(pendingProduct, recipient);

        setCartOpen(true);
        toast.success("Blessing added to your cart", {
            description: recipient?.name ? `For: ${recipient.name}` : pendingProduct.name,
            duration: 3000,
        });
        setPendingProduct(null);
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 bg-parchment">
            <div className="max-w-6xl mx-auto">
                <PageHeader
                    badge="Blessings & Offerings"
                    title="Temple Services"
                    subtitle="Order a service or blessing."
                />
                <div className="text-center -mt-10 mb-16">
                    <button
                        onClick={() => document.getElementById('priests-section').scrollIntoView({ behavior: 'smooth' })}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-2 mx-auto transition-all"
                    >
                        <Users size={16} />
                        Meet the Priests performing these services
                    </button>
                </div>

                {loading && (!products || products.length === 0)
                    ? <SkeletonGrid />
                    : <ServiceGrid products={products ?? []} onAddToCart={handleAddToCart} />
                }
            </div>
            <div className="mt-16 max-w-2xl mx-auto text-center">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-primary/10 shadow-sm border-t-4 border-primary">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                        Custom Puja or Blessing Requests
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        If you do not see a specific service you are looking for, or would like to request a 
                        special home puja or private blessing, please reach out to our head priest directly.
                    </p>
                    
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Contact Pandeet Narayan Khakurel</span>
                        <a 
                            href="tel:+1234567890" 
                            className="text-2xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <Phone size={20} className="text-primary" />
                            (123) 456-7890
                        </a>
                        <p className="text-[10px] text-muted-foreground italic mt-2">
                            Available for consultations and private divine services.
                        </p>
                    </div>
                </div>
            </div>

                {/* --- Full-Width Wrapper Section --- */}
                {/* This 'section' is what stretches the color from left to right edge */}
                <section id="priests-section" className="w-full bg-stone-50/50 border-y border-border mt-32 py-20">
                    
                    {/* --- Centered Content Container --- */}
                    {/* This 'div' keeps the text and cards aligned with the rest of your site */}
                    <div className="max-w-6xl mx-auto px-4">
                        
                        <div className="text-center mb-16">
                            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">Our Priests</h2>
                        </div>

                        {/* Two-card layout centered */}
                        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            {/* Priest Card 1 */}
                            <div className="bg-white rounded-2xl p-10 ring-1 ring-border shadow-sm flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
                                    <User size={40} className="text-primary" />
                                </div>
                                <h3 className="font-bold text-2xl text-foreground">Narayan Khakurel</h3>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Priest</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Narayan Khakurel has been a priest at Pashupatinath Temple since 2024. He is a dedicated Hindu Priest and Sanskrit scholar with over three decades of experience in temple leadership, Vedic rituals, religious education, and community service. Additionally, he is an expert in Shaiva and
                                    Vaishnava traditions, spiritual counseling, festival coordination, and priest training.
                                </p>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4"></p>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Phone Number: 512-348-5400</p>
                            </div>

                            {/* Priest Card 2 */}
                            <div className="bg-white rounded-2xl p-10 ring-1 ring-border shadow-sm flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
                                    <User size={40} className="text-primary" />
                                </div>
                                <h3 className="font-bold text-2xl text-foreground">Kulchandra Subedi</h3>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Priest</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                Kulchandra Subedi has been a priest at Pashupatinath Temple since 2025. He is an expert at performing daily worship, abhishek, aarti, annual maha‑snan. Additionally, he specializes in doing special Vedic rituals such as Rudri, Chandi, Satyanarayan Katha, Shraddha, Graha Shanti,
                                Wedding, Bratabandha, Naming Ceremony, and other sacred samskaras, all of which he performs according to authentic Vedic procedures.
                                </p>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4"></p>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Phone Number: 608-628-5440</p>
                            </div>
                        </div>

                        <div className="flex justify-center mt-12">
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                            >
                                <ArrowUp size={12} />
                                Back to top
                            </button>
                        </div>
                    </div>
                </section>
                {/* --- END PRIEST SECTION --- */}


            {/* Recipient dialog — intercepts Add to Cart */}
            <BlessingForDialog
                product={pendingProduct}
                productIndex={pendingIndex}
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setPendingProduct(null); }}
                onConfirm={handleDialogConfirm}
            />

            {/* Cart drawer — opens after successful add */}
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
        </div>
    );
};

export default ServicesPage;
