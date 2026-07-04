import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertTriangle, Shield, Trash2, User, Users, ScrollText, Loader2,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useUserStore } from "../stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

// ─── Delete Account Dialog ────────────────────────────────────────────────────

function DeleteAccountDialog({ open, onClose }) {
    const { deleteAccount, loading } = useUserStore();
    const navigate = useNavigate();
    const [confirmText, setConfirmText] = useState("");

    const canDelete = confirmText.trim() === "DELETE";

    const handleDelete = async () => {
        if (!canDelete) return;
        try {
            await deleteAccount();
            navigate("/login");
        } catch {
            // error toast is handled in the store
        }
    };

    const handleClose = () => {
        setConfirmText("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive font-heading">
                        <AlertTriangle size={18} className="shrink-0" />
                        Delete Your Account
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-4 pt-1">
                            {/* Compliance notice */}
                            <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 space-y-2">
                                <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wide">
                                    <ScrollText size={13} className="shrink-0" />
                                    Tax &amp; Accounting Notice
                                </div>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    Your personal profile and family data will be{" "}
                                    <span className="font-semibold">permanently deleted</span>.
                                    However, transaction records will be{" "}
                                    <span className="font-semibold">retained anonymously</span> for
                                    nonprofit accounting and tax purposes as required by law.
                                </p>
                            </div>

                            {/* What will be deleted */}
                            <div className="space-y-2 text-sm text-foreground">
                                <p className="font-semibold text-foreground">This will permanently delete:</p>
                                <ul className="space-y-1 pl-1">
                                    {[
                                        "Your name, email, and password",
                                        "Your profile details (Gotra, Rashi, birthday)",
                                        "Your entire Family Circle",
                                        "Your saved cart items",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-muted-foreground">
                                            <Trash2 size={12} className="text-destructive shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Separator />

                            {/* Confirmation input */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">
                                    Type{" "}
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-destructive font-mono font-bold">
                                        DELETE
                                    </code>{" "}
                                    to confirm
                                </Label>
                                <Input
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                    className="font-mono tracking-widest border-destructive/40 focus-visible:ring-destructive"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1 gap-2"
                                    onClick={handleDelete}
                                    disabled={!canDelete || loading}
                                >
                                    {loading ? (
                                        <><Loader2 size={14} className="animate-spin" /> Deleting…</>
                                    ) : (
                                        <><Trash2 size={14} /> Delete My Account</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const SettingsPage = () => {
    const { user } = useUserStore();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <div className="min-h-screen bg-parchment pt-28 pb-16 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <PageHeader
                    badge="Account"
                    title="Settings"
                    subtitle="Manage your account preferences and privacy."
                />

                {/* ── Account Info ── */}
                <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                        <User size={15} className="text-primary" />
                        <h2 className="font-semibold text-sm text-foreground">Account Information</h2>
                    </div>
                    <div className="px-6 py-5 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Name</span>
                            <span className="font-medium text-foreground">{user?.name}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium text-foreground">{user?.email}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Family members</span>
                            <span className="font-medium text-foreground flex items-center gap-1.5">
                                <Users size={13} className="text-primary" />
                                {user?.family?.length ?? 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Privacy ── */}
                <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                        <Shield size={15} className="text-primary" />
                        <h2 className="font-semibold text-sm text-foreground">Privacy &amp; Data</h2>
                    </div>
                    <div className="px-6 py-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
                        <p>
                            Your personal data is used solely to facilitate sacred services and
                            communicate with you about your bookings. We do not sell or share your
                            information with third parties.
                        </p>
                        <p>
                            Transaction records are retained in accordance with IRS requirements for
                            nonprofit organizations and may be kept for up to 7 years even after
                            account deletion.
                        </p>
                    </div>
                </div>

                {/* ── Danger Zone ── */}
                <div className="bg-card rounded-2xl ring-1 ring-destructive/30 overflow-hidden">
                    <div className="px-6 py-4 border-b border-destructive/20 flex items-center gap-2 bg-destructive/5">
                        <AlertTriangle size={15} className="text-destructive" />
                        <h2 className="font-semibold text-sm text-destructive">Danger Zone</h2>
                    </div>
                    <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-foreground">Delete Account</p>
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                                Permanently remove your profile and all personal data. Transaction
                                records will be retained anonymously for tax compliance.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive hover:text-white gap-2 transition-colors"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 size={14} />
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>

            <DeleteAccountDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            />
        </div>
    );
};

export default SettingsPage;
