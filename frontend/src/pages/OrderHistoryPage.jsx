import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
    ShoppingBag, Calendar, Sparkles, Receipt, User,
    Info, Copy, AlertCircle, Clock, CheckCircle2 
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useOrderStore } from "../stores/useOrderStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import zelleQrCode from "../assets/zelle-qr.png"; // Ensure this path is correct

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS = {
    completed: {
        label: "Blessed ✓",
        className: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    processing: {
        label: "Processing",
        className: "border-primary/40 bg-primary/10 text-primary",
    },
    pending: {
        label: "Pending",
        className: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-400",
    },
    cancelled: {
        label: "Cancelled",
        className: "border-border bg-muted text-muted-foreground",
    },
};

function statusCfg(s) {
    return STATUS[s] ?? STATUS.pending;
}

function fmt(n) {
    return `$${Number(n ?? 0).toFixed(2)}`;
}

function shortId(id) {
    return `#${String(id).slice(-8).toUpperCase()}`;
}

function fmtDate(d) {
    return new Date(d).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });
}

function getOrderRecipients(order) {
    const perItem = (order.products ?? [])
        .map((item) => item.recipient?.name)
        .filter(Boolean);
    if (perItem.length > 0) return [...new Set(perItem)];
    if (order.recipient?.name) return [order.recipient.name];
    return [];
}

// ─── Blessing-for cell ────────────────────────────────────────────────────────

function BlessingFor({ order }) {
    const names = getOrderRecipients(order);

    if (names.length === 0) {
        return <span className="text-xs text-muted-foreground italic">N/A</span>;
    }

    let label;
    if (names.length === 1) {
        label = names[0];
    } else if (names.length === 2) {
        label = names.join(", ");
    } else {
        const overflow = names.length - 1;
        label = (
            <>
                {names[0]}{" "}
                <span
                    className="underline decoration-dotted cursor-default"
                    title={`All recipients: ${names.join(", ")}`}
                >
                    + {overflow} other{overflow !== 1 ? "s" : ""}
                </span>
            </>
        );
    }

    return (
        <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <User size={11} className="shrink-0" />
            {label}
        </span>
    );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function TableSkeleton() {
    return (
        <div className="rounded-xl ring-1 ring-border overflow-hidden bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Blessing For</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-24 rounded-lg ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
            <div className="bg-primary/10 rounded-full p-6">
                <ShoppingBag size={48} className="text-primary/60" />
            </div>
            <div className="space-y-2 max-w-xs">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                    No orders yet
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    You haven't made any sacred offerings yet.
                    Explore our services and book your first blessing.
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

// ─── Order detail sheet ───────────────────────────────────────────────────────

function OrderDetailSheet({ order, open, onClose }) {
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    if (!order) return null;

    const cfg = statusCfg(order.status);
    const displayMemoId = `ORDER-${order._id?.slice(-6).toUpperCase()}`;

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    return (
        <>
            <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
                <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                    <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                        <SheetTitle className="font-heading text-xl flex items-center gap-2">
                            <Receipt size={18} className="text-primary" />
                            Order Details
                        </SheetTitle>
                        <SheetDescription className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                {shortId(order._id)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar size={11} />
                                {fmtDate(order.createdAt)}
                            </span>
                            <Badge variant="outline" className={`text-xs ${cfg.className}`}>
                                {cfg.label}
                            </Badge>
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                        {/* ─── PENDING PAYMENT BOX ─── */}
                        {order.status === "pending" && (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-100/70 border-b border-amber-200">
                                    <Clock size={14} className="text-amber-700 shrink-0 animate-pulse" />
                                    <p className="text-xs font-semibold text-amber-800 tracking-wide">
                                        Awaiting Payment Verification
                                    </p>
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* Status message */}
                                    <p className="text-sm text-amber-800 leading-relaxed">
                                        If you've already sent payment, allow{" "}
                                        <span className="font-semibold">24–48 hours</span>{" "}
                                        for our team to verify and update your status to Processing.
                                    </p>

                                    <Separator className="bg-amber-200/60" />

                                    {/* Payment details */}
                                    <div className="space-y-2.5">
                                        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                                            Haven't paid yet?
                                        </p>

                                        {/* Zelle row */}
                                        <div className="bg-white rounded-xl px-3 py-2.5 border border-amber-100 shadow-sm space-y-2">
                                            <div className="flex items-center gap-2.5">
                                                <img src={zelleQrCode} className="w-9 h-9 rounded object-contain shrink-0" alt="Zelle QR" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">Zelle</p>
                                                    <p className="text-sm font-semibold text-foreground break-all leading-snug">greateraustinnepalisociety@gmail.com</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsQrModalOpen(true)}
                                                className="text-xs font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                                            >
                                                View QR Code →
                                            </button>
                                        </div>

                                        {/* Memo row */}
                                        <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-amber-100 shadow-sm">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">Required Memo</p>
                                                <code className="text-base font-bold text-primary tracking-wide">{displayMemoId}</code>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(displayMemoId, "Memo")}
                                                className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 hover:text-amber-800 transition-colors"
                                                title="Copy memo"
                                            >
                                                <Copy size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recipients (Legacy) */}
                        {order.recipient?.name && (
                            <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2.5 border border-primary/15">
                                <User size={13} className="text-primary shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-primary uppercase leading-none mb-0.5">Blessing for</p>
                                    <p className="text-sm font-medium">{order.recipient.name}</p>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="space-y-4">
                            {order.products?.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0">
                                    {item.product?.image && (
                                        <div className="w-14 h-14 rounded-lg overflow-hidden ring-1 ring-border shrink-0">
                                            <img src={item.product.image} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-heading text-sm font-semibold line-clamp-2">{item.product?.name}</p>
                                        {item.recipient?.name && <p className="text-xs text-primary mt-0.5">{item.recipient.name}</p>}
                                        <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold tabular-nums">{fmt(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 py-5 border-t border-border bg-stone-50/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">Method</span>
                            <span className="text-xs font-medium uppercase">Zelle Payment</span>
                        </div>
                        <Separator className="mb-3" />
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">Total Offering</span>
                            <span className="font-heading text-2xl font-bold text-primary leading-none">
                                {fmt(order.totalAmount)}
                            </span>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* EXPANDED QR MODAL */}
            {isQrModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsQrModalOpen(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-5" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-lg">Scan Zelle QR</h3>
                        <img src={zelleQrCode} alt="Zelle QR" className="w-64 h-64 mx-auto" />
                        <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Include Memo</p>
                            <p className="text-xl font-mono font-bold text-primary">{displayMemoId}</p>
                        </div>
                        <Button onClick={() => setIsQrModalOpen(false)} className="w-full rounded-xl">Close</Button>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── Orders table ─────────────────────────────────────────────────────────────

function OrdersTable({ orders, onView }) {
    return (
        <div className="rounded-xl ring-1 ring-border overflow-hidden bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Order</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Date</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Blessing For</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Total</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const cfg = statusCfg(order.status);
                        return (
                            <TableRow key={order._id} className="hover:bg-muted/30 transition-colors">
                                <TableCell><span className="font-mono text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{shortId(order._id)}</span></TableCell>
                                <TableCell><span className="text-sm text-foreground flex items-center gap-1.5"><Calendar size={12} className="text-muted-foreground" />{fmtDate(order.createdAt)}</span></TableCell>
                                <TableCell><BlessingFor order={order} /></TableCell>
                                <TableCell><Badge variant="outline" className={`text-xs font-semibold ${cfg.className}`}>{cfg.label}</Badge></TableCell>
                                <TableCell><span className="font-heading text-base font-bold text-primary tabular-nums">{fmt(order.totalAmount)}</span></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs" onClick={() => onView(order)}>
                                        <Receipt size={12} /> View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const OrderHistoryPage = () => {
    const { orders, fetchMyOrders, loading } = useOrderStore();
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]);

    return (
        <div className="min-h-screen bg-parchment pt-28 pb-16 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                <PageHeader
                    badge="Order History"
                    title="My Orders"
                    subtitle="Record of every blessing and service booked with us."
                />

                {loading ? (
                    <TableSkeleton />
                ) : orders.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-10">
                        <OrdersTable orders={orders} onView={setSelectedOrder} />

                        {/* ─── STATUS GUIDE SECTION ─── */}
                        <div className="bg-white rounded-2xl ring-1 ring-border p-6 shadow-sm border-l-4 border-primary">
                            <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Info size={18} className="text-primary" />
                                Order Status Guide
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
                                        <Clock size={14} /> Pending
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        If you have not paid, view the details of your order to complete payment. If you just paid, please allow 1-2 business days for our team to confirm your Zelle payment.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                        <Sparkles size={14} /> Processing
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Payment verified! The Guru has been notified and is currently preparing your sacred ceremony or service.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                                        <CheckCircle2 size={14} /> Blessed
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Completed! Your service has been performed by the Guru.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <OrderDetailSheet
                order={selectedOrder}
                open={selectedOrder !== null}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
};

export default OrderHistoryPage;