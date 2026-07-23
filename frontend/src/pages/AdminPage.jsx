import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { account, teams } from "../appwrite"; // Added for security routing guard
import {
    LayoutDashboard, Package, PlusCircle, ClipboardList,
    CalendarPlus, FileText, Trash2, Upload,
    Loader2, Menu, X, ArrowLeft, TrendingUp, Users, DollarSign, Edit,
} from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useEventStore } from "../stores/useEventStore";
import { useArticleStore } from "../stores/useArticleStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateEventForm from "../components/CreateEventForm";
import CreateArticleForm from "../components/CreateArticleForm";
import CreateProductForm from "../components/CreateProductForm";
import {
    Table, TableHeader, TableBody, TableRow,
    TableHead, TableCell,
} from "@/components/ui/table";

// ─── Sidebar config ───────────────────────────────────────────────────────────

const NAV_GROUPS = [
    {
        label: "Overview",
        items: [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
        label: "Services",
        items: [
            { id: "services", label: "All Services", icon: Package },
            { id: "new-service", label: "New Service", icon: PlusCircle },
            { id: "orders", label: "Orders", icon: ClipboardList },
        ],
    },
    {
        label: "Content",
        items: [
            { id: "events", label: "Manage Events", icon: CalendarPlus },
            { id: "add-event", label: "Add Event", icon: PlusCircle },
            { id: "articles", label: "Manage Articles", icon: FileText },
            { id: "add-article", label: "Write Article", icon: PlusCircle },
        ],
    },
];

// ─── Stat cards ───────────────────────────────────────────────────────────────

function StatCards({ products, allOrders }) {
    const total = allOrders.reduce((s, o) => s + (o.totalAmount ?? 0), 0);
    const pending = allOrders.filter((o) => o.status === "pending").length;

    const stats = [
        { label: "Total Services", value: products?.length ?? 0, icon: Package, accent: "text-primary" },
        { label: "Total Orders", value: allOrders.length, icon: ClipboardList, accent: "text-blue-500" },
        { label: "Revenue", value: `$${total.toFixed(0)}`, icon: DollarSign, accent: "text-emerald-500" },
        { label: "Pending", value: pending, icon: TrendingUp, accent: "text-amber-500" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, accent }) => (
                <Card key={label} className="ring-1 ring-border">
                    <CardContent className="pt-5 pb-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                                    {label}
                                </p>
                                <p className="text-3xl font-bold text-foreground font-heading leading-none">
                                    {value}
                                </p>
                            </div>
                            <div className={`bg-muted rounded-xl p-2.5 ${accent}`}>
                                <Icon size={18} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ─── Services table ───────────────────────────────────────────────────────────

function ServicesTable({ products, onDelete, onEdit }) {
    if (!products?.length) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                No services yet. Add one from <strong>New Service</strong>.
            </div>
        );
    }

    return (
        <div className="rounded-xl ring-1 ring-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                        <TableHead>Service</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((p) => (
                        <TableRow key={p._id || p.$id} className="hover:bg-muted/30">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-border shrink-0">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=60"; }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-foreground line-clamp-1">
                                        {p.name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-primary">
                                ${Number(p.price || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>
                                {p.category && (
                                    <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                                        {p.category}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(p)}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={15} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(p._id || p.$id)}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ─── Events Table ────────────────────────────────────────────────────────────

function EventsTable({ events, onDelete, onEdit }) {
    if (!events?.length) return <div className="text-center py-20 text-muted-foreground">No events found.</div>;

    return (
        <div className="rounded-xl ring-1 ring-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/60">
                        <TableHead>Event Title</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((ev) => (
                        <TableRow key={ev._id || ev.$id}>
                            <TableCell className="text-sm font-medium">{ev.title}</TableCell>
                            <TableCell className="text-xs">{ev.date} at {ev.time}</TableCell>
                            <TableCell className="text-xs">{ev.location}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <button onClick={() => onEdit(ev)} className="p-1.5 hover:text-primary"><Edit size={15} /></button>
                                <button onClick={() => onDelete(ev._id || ev.$id)} className="p-1.5 hover:text-destructive"><Trash2 size={15} /></button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ─── Articles Table ──────────────────────────────────────────────────────────

function ArticlesTable({ articles, onDelete, onEdit }) {
    if (!articles?.length) return <div className="text-center py-20 text-muted-foreground">No articles published.</div>;

    return (
        <div className="rounded-xl ring-1 ring-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/60">
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map((art) => (
                        <TableRow key={art._id || art.$id}>
                            <TableCell className="text-sm font-medium">{art.title}</TableCell>
                            <TableCell>
                                {art.category ? <Badge variant="secondary">{art.category}</Badge> : "None"}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <button onClick={() => onEdit(art)} className="p-1.5 hover:text-primary"><Edit size={15} /></button>
                                <button onClick={() => onDelete(art._id || art.$id)} className="p-1.5 hover:text-destructive"><Trash2 size={15} /></button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ─── Orders table ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function OrdersTable({ orders, onStatusChange }) {
    if (!orders?.length) return <div className="text-center py-20 text-muted-foreground">No orders yet.</div>;

    return (
        <div className="rounded-xl ring-1 ring-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                        <TableHead>Service & Recipient</TableHead>
                        <TableHead>Puja Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id || order.$id} className="hover:bg-muted/30 align-top">
                            <TableCell>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-foreground">
                                        {order.serviceName || "Service"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                        <Users size={10} /> {order.userName || "Guest User"}
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-primary">
                                        {order.pujaDate ? new Date(order.pujaDate).toLocaleDateString() : "TBD"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-sm font-bold">${Number(order.totalAmount || 0).toFixed(2)}</TableCell>

                            <TableCell>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
                                    {order.status}
                                </span>
                            </TableCell>

                            <TableCell className="text-right">
                                <select
                                    value={order.status}
                                    onChange={(e) => onStatusChange(order._id || order.$id, e.target.value)}
                                    className="text-[10px] font-bold rounded-md border bg-background px-1 py-1 focus:ring-1 focus:ring-primary outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ─── New Service form (Appwrite Storage File Integrated) ──────────────────────

function NewServiceForm({ onCreated, editingItem }) {
    const [form, setForm] = useState(editingItem || { name: "", description: "", price: "", category: "", image: "" });
    const [imageFile, setImageFile] = useState(null); // Local tracker for raw files
    const { createProduct, updateProduct, loading } = useProductStore();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Capture file object directly for storage uploads
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingItem) {
            await updateProduct(editingItem._id || editingItem.$id, form, imageFile);
        } else {
            await createProduct(form, imageFile);
        }
        setForm({ name: "", description: "", price: "", category: "", image: "" });
        setImageFile(null);
        onCreated?.();
    };

    return (
        <Card className="ring-1 ring-border max-w-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{editingItem ? "Edit Service" : "Create New Service"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="svc-name">Service Name</Label>
                            <Input id="svc-name" required placeholder="e.g. Satyanarayan Puja"
                                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="svc-price">Price ($)</Label>
                            <Input id="svc-price" type="number" required step="1" placeholder="e.g. 150"
                                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="svc-category">Category</Label>
                        <Input id="svc-category" placeholder="e.g. Ritual, Festival, Blessing"
                            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="svc-desc">Description</Label>
                        <Textarea id="svc-desc" required rows={3} className="resize-none"
                            placeholder="Brief description of the service..."
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Service Image</Label>
                        <div className="flex items-center gap-3">
                            <label htmlFor="svc-img" className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-colors">
                                <Upload size={14} /> Upload Image
                            </label>
                            <input id="svc-img" type="file" accept="image/*" className="sr-only" onChange={handleImage} />
                            {(imageFile || form.image) && <span className="text-xs text-emerald-600 font-medium">✓ Image ready</span>}
                        </div>
                    </div>
                    <Button type="submit" className="w-full gap-2 rounded-xl" disabled={loading}>
                        {loading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><PlusCircle size={15} /> {editingItem ? "Update Service" : "Create Service"}</>}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

// ─── Welcome panel fallback ──────────────────────────────────────────────────

function OverviewPanel() {
    return (
        <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to the Admin Dashboard</h2>
            <p>Select a section from the sidebar to begin managing temple content.</p>
        </div>
    );
}

// ─── Sidebar layout ──────────────────────────────────────────────────────────

function Sidebar({ active, onSelect, open, onClose }) {
    return (
        <>
            {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
            <aside className={`
                fixed top-0 left-0 h-full z-30 w-64 bg-card border-r border-border flex flex-col
                transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto
            `}>
                <div className="px-5 py-5 border-b border-border flex items-center justify-between">
                    <div>
                        <p className="font-heading text-base font-bold text-foreground">Temple Admin</p>
                        <p className="text-xs text-muted-foreground">Management Dashboard</p>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1.5 rounded-md hover:bg-muted text-muted-foreground"><X size={16} /></button>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                    {NAV_GROUPS.map((group) => (
                        <div key={group.label}>
                            <p className="px-3 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">{group.label}</p>
                            <div className="space-y-0.5">
                                {group.items.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => { onSelect(id); onClose(); }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                                    >
                                        <Icon size={16} />{label}
                                    </button>
                                ))}
                            </div>
                            <Separator className="mt-4" />
                        </div>
                    ))}
                </nav>
                <div className="px-3 py-4 border-t border-border">
                    <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <ArrowLeft size={15} />Back to Site
                    </Link>
                </div>
            </aside>
        </>
    );
}

const SECTION_TITLES = {
    overview: { title: "Dashboard Overview", sub: "Your temple at a glance." },
    services: { title: "All Services", sub: "Manage your offerings and blessings." },
    "new-service": { title: "New Service", sub: "Add a new blessing or ceremony." },
    orders: { title: "Orders", sub: "Track and update booking statuses." },
    events: { title: "All Events", sub: "Manage your temple calendar." },
    "add-event": { title: "Add Event", sub: "Schedule a community event." },
    articles: { title: "All Articles", sub: "Manage published wisdom content." },
    "add-article": { title: "Write Article", sub: "Publish new wisdom and heritage content." },
};

// ─── Main Admin Component ─────────────────────────────────────────────────────

const AdminPage = () => {
    const [section, setSection] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const { products, fetchAllProducts, deleteProduct } = useProductStore();
    const { allOrders, fetchAllOrders, updateOrderStatus } = useCartStore();
    const { events, fetchEvents, removeEvent } = useEventStore();
    const { articles, fetchAllArticles, deleteArticle } = useArticleStore();

    // 1. Security check layout rule
    useEffect(() => {
        const verifyAdminStatus = async () => {
            try {
                console.log("1. Checking if user is logged in...");
                const sessionCheck = await account.get();
                console.log("User session found:", sessionCheck.name);

                console.log("2. Fetching team memberships...");
                const teamsResponse = await teams.list();
                console.log("Teams found:", teamsResponse.teams);

                const userIsAdmin = teamsResponse.teams.some(t => 
                    t.$id === "6a50eae80013cfee754f" || t.name.toLowerCase() === "admin"
                );

                if (userIsAdmin) {
                    console.log("3. Success! User belongs to the Admin team.");
                    setIsAuthorized(true);
                } else {
                    console.warn("3. Failed: User is logged in, but is NOT in the admin team.");
                    alert("Not authorized. Check console for team list.");
                    // window.location.replace("/"); <-- Temporarily disabled
                }
            } catch (err) {
                console.error("4. CRASH: The security verification threw an error:", err);
                alert("Security check crashed. Check console for the exact error.");
                // window.location.replace("/"); <-- Temporarily disabled
            }
        };
        verifyAdminStatus();
    }, []);
    useEffect(() => { if (isAuthorized) { fetchAllProducts(); fetchAllOrders(); fetchEvents(); fetchAllArticles(); } }, [isAuthorized, fetchAllProducts, fetchAllOrders, fetchEvents, fetchAllArticles]);

    const triggerEdit = (item, targetSection) => {
        setEditingItem(item);
        setSection(targetSection);
    };

    const handleSectionChange = (newSection) => {
        if (!newSection.startsWith("add") && newSection !== "new-service") setEditingItem(null);
        setSection(newSection);
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-parchment flex items-center justify-center">
                <Loader2 size={30} className="animate-spin text-primary" />
            </div>
        );
    }

    const { title, sub } = SECTION_TITLES[section] ?? SECTION_TITLES.overview;

    return (
        <div className="flex min-h-screen bg-parchment">
            <Sidebar active={section} onSelect={handleSectionChange} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border px-6 py-3.5 flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-md hover:bg-muted text-muted-foreground"><Menu size={18} /></button>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-heading text-lg font-bold text-foreground leading-none">{title}</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                    </div>
                    <Badge variant="outline" className="border-primary/50 text-primary text-xs tracking-wider hidden sm:flex">Admin</Badge>
                </header>

                <main className="flex-1 overflow-auto px-6 py-8">
                    <StatCards products={products ?? []} allOrders={allOrders ?? []} />

                    {section === "overview" && <OverviewPanel />}
                    {section === "services" && <ServicesTable products={products} onDelete={deleteProduct} onEdit={(item) => triggerEdit(item, "new-service")} />}
                    {section === "new-service" && <NewServiceForm editingItem={editingItem} onCreated={() => handleSectionChange("services")} />}
                    {section === "orders" && <OrdersTable orders={allOrders} onStatusChange={updateOrderStatus} />}
                    {section === "events" && <EventsTable events={events} onDelete={removeEvent} onEdit={(item) => triggerEdit(item, "add-event")} />}
                    {section === "add-event" && <CreateEventForm editingItem={editingItem} onFinished={() => handleSectionChange("events")} />}
                    {section === "articles" && <ArticlesTable articles={articles} onDelete={deleteArticle} onEdit={(item) => triggerEdit(item, "add-article")} />}
                    {section === "add-article" && <CreateArticleForm editingItem={editingItem} onFinished={() => handleSectionChange("articles")} />}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
