import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
    ShoppingBag, Minus, Plus, Trash2,
    MoveRight, Loader2, Sparkles, User, CheckCircle,
    ScrollText, MessageSquare, Calendar, X
} from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import zelleQrCode from "../assets/zelle-qr.png";

const FALLBACK_IMG =
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=70";

function fmt(n) {
    return `$${Number(n ?? 0).toFixed(2)}`;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
            <div className="bg-primary/10 rounded-full p-6">
                <ShoppingBag size={48} className="text-primary/60" />
            </div>
            <div className="space-y-2 max-w-xs">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                    Your cart is empty
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    You haven't added any blessings or services yet.
                </p>
            </div>
            <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-6 h-10 rounded-xl transition-colors"
            >
                <Sparkles size={14} />
                Explore Services
            </Link>
        </div>
    );
}

// ─── Single cart item row ─────────────────────────────────────────────────────

function CartItemRow({ item }) {
    const { removeFromCart, updateQuantity, updateRecipientDetails } = useCartStore();
    const cid = item.cartItemId;

    // Local state — typing never touches Zustand, so no store-driven re-renders
    // while the user is in the middle of a word.
    const [local, setLocal] = useState({
        name:  item.recipient?.name  ?? "",
        gotra: item.recipient?.gotra ?? "",
        rashi: item.recipient?.rashi ?? "",
    });

    // If the store item's cartItemId changes (different item entirely), re-init.
    const prevCid = useRef(cid);
    useEffect(() => {
        if (prevCid.current !== cid) {
            setLocal({
                name:  item.recipient?.name  ?? "",
                gotra: item.recipient?.gotra ?? "",
                rashi: item.recipient?.rashi ?? "",
            });
            prevCid.current = cid;
        }
    }, [cid, item.recipient]);

    // Commit local state to the store only when the user leaves a field.
    const commitToStore = (updated) => {
        updateRecipientDetails(cid, updated);
    };

    const hasName = !!local.name.trim();

    return (
        <Card className="ring-1 ring-border overflow-hidden" id={cid}>
            <div className="flex gap-4 p-4 sm:p-5 items-start sm:items-center">
                {/* --- Service Image --- */}
                <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden ring-1 ring-border">
                    <img
                        src={item.image || FALLBACK_IMG}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                        {item.category && (
                            <Badge variant="outline" className="mb-1 border-primary/40 text-primary text-[10px]">
                                {item.category}
                            </Badge>
                        )}
                        <p className="font-heading text-base font-semibold text-foreground leading-snug line-clamp-2">
                            {item.name}
                        </p>

                        {/* --- Recipient & Ritual Details Section ---
                            Both panels are always mounted; toggled with `hidden` so that
                            switching panels never unmounts an input the user is focused on. */}

                        {/* Panel A: name missing */}
                        <div className={`mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl${hasName ? " hidden" : ""}`}>
                            <Label className="text-[10px] font-bold text-destructive uppercase flex items-center gap-1 mb-1.5">
                                <X size={10} /> Recipient Name Required
                            </Label>
                            <Input
                                placeholder="Enter Name for Blessing"
                                className="h-8 text-xs bg-background border-destructive/50 focus-visible:ring-destructive"
                                value={local.name}
                                onChange={(e) => setLocal((p) => ({ ...p, name: e.target.value }))}
                                onBlur={() => commitToStore(local)}
                            />
                        </div>

                        {/* Panel B: name present — show gotra / rashi */}
                        <div className={`mt-2 space-y-3 p-3 bg-muted/30 rounded-xl border border-border/50${!hasName ? " hidden" : ""}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <User size={12} className="text-primary shrink-0" />
                                    <p className="text-xs font-bold text-foreground">
                                        Ritual Details for: {local.name}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = { ...local, name: "" };
                                        setLocal(updated);
                                        commitToStore(updated);
                                    }}
                                    className="text-[10px] text-muted-foreground hover:text-destructive underline"
                                >
                                    Edit Name
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-muted-foreground">Gotra</Label>
                                    <Input
                                        placeholder="e.g. Kashyap"
                                        className="h-8 text-xs bg-background"
                                        value={local.gotra}
                                        onChange={(e) => setLocal((p) => ({ ...p, gotra: e.target.value }))}
                                        onBlur={() => commitToStore(local)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-muted-foreground">Rashi</Label>
                                    <Input
                                        placeholder="e.g. Vrish"
                                        className="h-8 text-xs bg-background"
                                        value={local.rashi}
                                        onChange={(e) => setLocal((p) => ({ ...p, rashi: e.target.value }))}
                                        onBlur={() => commitToStore(local)}
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-primary font-bold mt-2">{fmt(item.price)}</p>
                    </div>

                    {/* --- Quantity & Actions --- */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => updateQuantity(cid, item.quantity - 1)} 
                                className="w-7 h-7 flex items-center justify-center rounded-lg ring-1 ring-border hover:bg-muted transition-colors"
                            >
                                <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(cid, item.quantity + 1)} 
                                className="w-7 h-7 flex items-center justify-center rounded-lg ring-1 ring-border hover:bg-muted transition-colors"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        <p className="text-base font-bold text-foreground w-16 text-right tabular-nums">
                            {fmt(item.price * item.quantity)}
                        </p>
                        <button 
                            onClick={() => removeFromCart(cid)} 
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function OrderSummary() {
    const { cart: rawCart, subtotal, total, processZelleOrder } = useCartStore();
    const cart = Array.isArray(rawCart) ? rawCart : [];
    const [processing, setProcessing] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [additionalNote, setAdditionalNote] = useState("");

    const minPujaDate = new Date();
    minPujaDate.setDate(minPujaDate.getDate() + 7);
    const minDateStr = minPujaDate.toISOString().split("T")[0];

    const [pujaDate, setPujaDate] = useState(minDateStr);
    const savings = Number(subtotal) - Number(total);
    const recipientSummary = [...new Set(cart.map((item) => item.recipient?.name).filter(Boolean))];

    const handleCheckout = async () => {
        if (!pujaDate || pujaDate < minDateStr) {
            toast.error("Please select a valid date (7 days notice required)");
            return;
        }
    
        const itemsMissingRecipient = cart.filter(item => !item.recipient?.name || item.recipient.name.trim() === "");
        
        if (itemsMissingRecipient.length > 0) {
            toast.error(`Please provide a recipient name for: ${itemsMissingRecipient[0].name}`);
            const element = document.getElementById(itemsMissingRecipient[0].cartItemId);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    
        setProcessing(true);
        try {
            await processZelleOrder({ additionalNote, pujaDate });
        } catch (error) {
            setProcessing(false);
        }
    };

    return (
        <>
            <Card className="ring-1 ring-border sticky top-24">
                <CardHeader className="pb-0">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-5">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                            </span>
                            <span className="font-medium text-foreground">{fmt(subtotal)}</span>
                        </div>
                        {savings > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Savings</span>
                                <span className="font-medium text-emerald-600">−{fmt(savings)}</span>
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="puja-date" className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar size={12} /> Requested Puja Date
                            </Label>
                            <Input 
                                id="puja-date" 
                                type="date" 
                                min={minDateStr} 
                                value={pujaDate} 
                                onChange={(e) => setPujaDate(e.target.value)} 
                                className="bg-muted/30 focus:ring-primary" 
                            />
                            <p className="text-[10px] text-muted-foreground italic">
                                * Minimum 7-day notice required for preparations.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="special-notes" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare size={12} className="text-primary" /> Additional Notes
                            </Label>
                            <Textarea 
                                id="special-notes" 
                                placeholder="Any specific requests for the priest..." 
                                className="text-xs resize-none bg-muted/30" 
                                rows={2} 
                                value={additionalNote} 
                                onChange={(e) => setAdditionalNote(e.target.value)} 
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-heading text-2xl font-bold text-primary leading-none">
                            {fmt(total)}
                        </span>
                    </div>
                    {recipientSummary.length > 0 && (
                        <div className="bg-primary/5 rounded-xl px-3 py-3 border border-primary/15 space-y-1.5">
                            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                Blessings for
                            </p>
                            {recipientSummary.map((name) => (
                                <div key={name} className="flex items-center gap-1.5">
                                    <User size={11} className="text-primary shrink-0" />
                                    <p className="text-sm font-medium text-foreground">{name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button 
                        className="w-full gap-2 rounded-xl h-12 text-sm font-semibold" 
                        onClick={handleCheckout} 
                        disabled={processing || cart.length === 0}
                    >
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" /> 
                                Recording Booking…
                            </>
                        ) : (
                            <>
                                <CheckCircle size={15} /> 
                                Place Booking & Continue
                            </>
                        )}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center px-2 leading-relaxed">
                        Booking will be recorded. Please use the <span className="font-bold text-primary">Order ID</span> provided next in your Zelle memo.
                    </p>

                    {/* Non-refund notice */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3 flex items-start gap-2.5">
                        <ScrollText size={14} className="text-primary shrink-0 mt-px" />
                        <p className="text-[11px] text-foreground/70 leading-relaxed">
                            <span className="font-semibold text-foreground">All bookings are final and non-refundable.</span>{" "}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <Link 
                            to="/services" 
                            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                        >
                            Continue Shopping <MoveRight size={14} />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

const CartPage = () => {
    const { cart: rawCart } = useCartStore();
    const cart = Array.isArray(rawCart) ? rawCart : [];
    return (
        <div className="min-h-screen bg-parchment pt-28 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                <PageHeader 
                    badge="Services & Blessings" 
                    title="My Cart" 
                    subtitle={cart.length > 0 ? `${cart.reduce((s, i) => s + i.quantity, 0)} blessing(s) selected` : undefined} 
                    className="mb-10" 
                />
                {cart.length === 0 ? <EmptyCart /> : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <CartItemRow key={item.cartItemId ?? item._id} item={item} />
                            ))}
                        </div>
                        <div className="lg:col-span-1"><OrderSummary /></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;