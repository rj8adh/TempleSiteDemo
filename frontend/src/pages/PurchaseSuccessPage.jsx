import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
    CheckCircle, ArrowRight, Loader2, ReceiptText, 
    Copy, Info, Maximize2, X 
} from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import zelleQrCode from "../assets/zelle-qr.png";

const PurchaseSuccessPage = () => {
    const [isProcessing, setIsProcessing] = useState(true);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const { clearCart } = useCartStore();
    const [searchParams] = useSearchParams();

    // The Zelle Email - unified across the component
    const ZELLE_EMAIL = "greateraustinnepalisociety@gmail.com";

    const orderId = searchParams.get("orderId");
    const shortId = orderId?.slice(-6).toUpperCase() || "TEMPLE";
    const displayOrderId = `ORDER-${shortId}`;

    useEffect(() => {
        const finalizeZelleOrder = async () => {
            // Lock the cart and clear it to prevent "zombie" items
            await clearCart();
            setIsProcessing(false);
        };
        finalizeZelleOrder();
    }, [clearCart]);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    if (isProcessing) {
        return (
            <div className="min-h-screen bg-parchment flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="animate-spin text-primary" size={22} />
                <span className="text-base">Finalizing your booking…</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-parchment flex items-center justify-center px-4 py-20">
            <Confetti numberOfPieces={150} recycle={false} />

            <div className="max-w-md w-full bg-card ring-1 ring-border rounded-2xl shadow-sm p-8 md:p-10 text-center">
                <div className="bg-emerald-50 rounded-full p-4 w-fit mx-auto mb-6">
                    <CheckCircle className="text-emerald-500 w-10 h-10" />
                </div>

                <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Booking Received</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Your request has been recorded. Please complete payment via Zelle to confirm your Puja.
                </p>

                <div className="bg-muted/30 border border-border rounded-2xl p-6 mb-8 text-left">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Info size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Complete Payment</span>
                    </div>

                    {/* QR Thumbnail Section */}
                    <div className="flex flex-col items-center mb-6 bg-white p-4 rounded-xl border border-border/50 gap-3">
                        <div 
                            className="group relative cursor-pointer bg-stone-50 p-2 rounded-lg border border-stone-100 hover:ring-2 hover:ring-primary/20 transition-all"
                            onClick={() => setIsQrModalOpen(true)}
                        >
                            <img src={zelleQrCode} alt="Zelle QR" className="w-32 h-32 object-contain" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-lg">
                                <Maximize2 size={20} className="text-primary" />
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsQrModalOpen(true)}
                            className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1 hover:underline"
                        >
                            <Maximize2 size={10} /> Tap to Expand QR
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Zelle Recipient */}
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Recipient Email</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm font-semibold truncate mr-2">{ZELLE_EMAIL}</p>
                                <button 
                                    onClick={() => copyToClipboard(ZELLE_EMAIL, "Email")}
                                    className="p-1 hover:bg-primary/10 rounded transition-colors"
                                >
                                    <Copy size={14} className="text-muted-foreground hover:text-primary" />
                                </button>
                            </div>
                        </div>

                        {/* Payment Memo (Crucial for Admin) */}
                        <div className="pt-3 border-t border-border">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Required Payment Memo</p>
                            <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/20 mt-1">
                                <p className="text-xl font-mono font-bold text-primary">{displayOrderId}</p>
                                <button 
                                    onClick={() => copyToClipboard(orderId || displayOrderId, "Memo")}
                                    className="p-1 hover:bg-primary/10 rounded transition-colors"
                                >
                                    <Copy size={18} className="text-primary" />
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 italic leading-tight">
                                * Please include this ID in your Zelle notes so we can verify your booking.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link to="/orders">
                        <Button className="w-full gap-2 rounded-xl h-11">
                            <ReceiptText size={16} /> View My Bookings
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost" className="w-full gap-2 rounded-xl h-11 text-muted-foreground">
                            Return Home <ArrowRight size={15} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* FULL SCREEN QR MODAL */}
            {isQrModalOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsQrModalOpen(false)}
                >
                    <div 
                        className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setIsQrModalOpen(false)}
                            className="absolute right-4 top-4 p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="text-center space-y-5">
                            <h3 className="text-lg font-bold text-stone-900">Scan Zelle QR Code</h3>
                            <div className="bg-white p-4 rounded-2xl border-2 border-stone-100 inline-block shadow-inner">
                                <img 
                                    src={zelleQrCode} 
                                    alt="Enlarged Zelle QR" 
                                    className="w-64 h-64 object-contain" 
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-stone-800">{ZELLE_EMAIL}</p>
                                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">
                                    Memo: {displayOrderId}
                                </p>
                            </div>
                            <Button 
                                onClick={() => setIsQrModalOpen(false)}
                                className="w-full rounded-xl h-11"
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseSuccessPage;