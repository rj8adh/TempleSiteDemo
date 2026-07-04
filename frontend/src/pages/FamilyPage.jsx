import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
    Users, UserPlus, Pencil, Trash2, Cake, Heart,
    Loader2, ArrowRight, Sparkles, ScrollText
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ─── Constants ────────────────────────────────────────────────────────────────

const RELATIONSHIPS = ["Spouse", "Child", "Parent", "Sibling", "Friend", "Other"];

// RASHIS constant removed as we are using a text input now

const RELATIONSHIP_COLORS = {
    Self:    "bg-primary/10 text-primary border-primary/20",
    Spouse:  "bg-rose-50    text-rose-700    border-rose-200",
    Child:   "bg-sky-50     text-sky-700     border-sky-200",
    Parent:  "bg-amber-50   text-amber-700   border-amber-200",
    Sibling: "bg-violet-50  text-violet-700  border-violet-200",
    Friend:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    Other:   "bg-muted      text-muted-foreground border-border",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatBirthday(dateVal) {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    const month = d.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
    const day   = d.getUTCDate();
    return `${month} ${ordinal(day)}`;
}

function avatarColor(name = "") {
    const palette = [
        "bg-primary/20 text-primary",
        "bg-rose-100 text-rose-600",
        "bg-sky-100 text-sky-600",
        "bg-violet-100 text-violet-600",
        "bg-emerald-100 text-emerald-600",
        "bg-amber-100 text-amber-600",
    ];
    const idx = name.charCodeAt(0) % palette.length;
    return palette[idx] || palette[0];
}

function initials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
    return (
        <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
            <div className="bg-primary/10 rounded-full p-6">
                <Users size={48} className="text-primary/60" />
            </div>
            <div className="space-y-2 max-w-xs">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                    Your family circle is empty
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Add members to easily book blessings for them — no re-entering details every time.
                </p>
            </div>
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-6 h-10 rounded-xl transition-colors"
            >
                <UserPlus size={14} />
                Add Your First Member
            </button>
        </div>
    );
}

// ─── Member card ──────────────────────────────────────────────────────────────

function MemberCard({ member, onEdit, onDelete, deleting }) {
    const rel        = member.relationship || "Other";
    const badgeCls   = RELATIONSHIP_COLORS[rel] || RELATIONSHIP_COLORS.Other;
    const birthday   = formatBirthday(member.birthday);
    const avatarCls  = avatarColor(member.name);

    return (
        <div className="bg-card ring-1 ring-border rounded-2xl p-5 flex gap-4 items-start hover:ring-primary/30 transition-all duration-200 shadow-sm">
            {/* Avatar */}
            <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-base ${avatarCls}`}>
                {initials(member.name)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
                <div>
                    <p className="font-heading text-lg font-bold text-foreground leading-tight truncate">
                        {member.name}
                    </p>
                    {rel && rel !== "Other" && (
                        <Badge
                            variant="outline"
                            className={`text-[10px] mt-1 font-medium px-2 py-0.5 ${badgeCls}`}
                        >
                            {rel}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    {birthday && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Cake size={11} className="text-primary shrink-0" />
                            <span>{birthday}</span>
                        </div>
                    )}
                    {member.gotra && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ScrollText size={11} className="text-primary shrink-0" />
                            <span>Gotra: {member.gotra}</span>
                        </div>
                    )}
                    {member.rashi && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Sparkles size={11} className="text-primary shrink-0" />
                            <span>Rashi: {member.rashi}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={() => onEdit(member)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
                    title="Edit"
                >
                    <Pencil size={14} />
                </button>

                {/* Prevent deleting the main user profile from this view */}
                {!member.isMainUser && (
                    <button
                        onClick={() => onDelete(member._id)}
                        disabled={deleting === member._id}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors disabled:opacity-40"
                        title="Remove"
                    >
                        {deleting === member._id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />
                        }
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Add / Edit dialog ────────────────────────────────────────────────────────

const EMPTY_FORM = { name: "", relationship: "", birthday: "", gotra: "", rashi: "" };

function MemberDialog({ open, onOpenChange, initial, onSave, saving }) {
    const isEdit = Boolean(initial?._id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (open) {
            if (initial) {
                setForm({
                    name:         initial.name         ?? "",
                    relationship: initial.relationship ?? "",
                    gotra:        initial.gotra        ?? "",
                    rashi:        initial.rashi        ?? "",
                    birthday:     initial.birthday
                        ? new Date(initial.birthday).toISOString().split("T")[0]
                        : "",
                });
            } else {
                setForm(EMPTY_FORM);
            }
            setTouched(false);
        }
    }, [open, initial]);

    const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

    const nameInvalid = touched && form.name.trim().length === 0;
    const canSubmit   = form.name.trim().length > 0 && !saving;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!canSubmit) return;
        onSave({
            name:         form.name.trim(),
            relationship: form.relationship || "",
            birthday:     form.birthday || null,
            gotra:        form.gotra.trim() || "",
            rashi:        form.rashi.trim() || "", // Trim the rashi text
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-heading text-xl font-bold">
                        {isEdit ? "Edit Member" : "Add Family Member"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="fm-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Full Name <span className="text-destructive normal-case font-normal tracking-normal">*</span>
                        </Label>
                        <Input
                            id="fm-name"
                            placeholder="e.g. Sita Manandhar"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            onBlur={() => setTouched(true)}
                            className={nameInvalid ? "ring-1 ring-destructive focus-visible:ring-destructive" : ""}
                            autoFocus
                        />
                        {nameInvalid && (
                            <p className="text-[11px] text-destructive">Name is required.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Relationship */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fm-rel" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Relationship
                            </Label>
                            <Select
                                value={form.relationship}
                                onValueChange={(v) => set("relationship", v)}
                                disabled={initial?.isMainUser} 
                            >
                                <SelectTrigger id="fm-rel" className={!form.relationship ? "text-muted-foreground" : ""}>
                                    <SelectValue placeholder="Select…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {initial?.isMainUser ? (
                                        <SelectItem value="Self">Self</SelectItem>
                                    ) : (
                                        RELATIONSHIPS.map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Birthday */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fm-bday" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Date of Birth
                            </Label>
                            <Input
                                id="fm-bday"
                                type="date"
                                value={form.birthday}
                                onChange={(e) => set("birthday", e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>

                    <Separator />
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Ritual Details (Optional)</p>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Gotra */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fm-gotra" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Gotra
                            </Label>
                            <Input
                                id="fm-gotra"
                                placeholder="e.g. Kashyap"
                                value={form.gotra}
                                onChange={(e) => set("gotra", e.target.value)}
                            />
                        </div>

                        {/* Rashi - Changed from Select to Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fm-rashi" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Rashi
                            </Label>
                            <Input
                                id="fm-rashi"
                                placeholder="e.g. Kumbh"
                                value={form.rashi}
                                onChange={(e) => set("rashi", e.target.value)}
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground italic">
                        Providing Gotra and Rashi helps the priest perform more accurate personalized Sankalpa.
                    </p>

                    <Button
                        type="submit"
                        className="w-full gap-2 rounded-xl h-11 font-semibold mt-2"
                        disabled={!canSubmit}
                    >
                        {saving ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Heart size={14} />
                                {isEdit ? "Save Changes" : "Add to Circle"}
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FamilyPage = () => {
    const {
        user,
        fetchFamilyMembers,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
    } = useUserStore();

    const familyArr = user?.family ?? [];
    const mainUserAsMember = user ? {
        _id: user._id,
        name: user.name,
        relationship: "Self",
        birthday: user.birthday,
        gotra: user.gotra,
        rashi: user.rashi,
        isMainUser: true
    } : null;

    const displayList = mainUserAsMember ? [mainUserAsMember, ...familyArr] : familyArr;

    const [dialogOpen, setDialogOpen]   = useState(false);
    const [editTarget, setEditTarget]   = useState(null);
    const [saving,     setSaving]       = useState(false);
    const [deleting,   setDeleting]     = useState(null);

    useEffect(() => {
        fetchFamilyMembers();
    }, [fetchFamilyMembers]);

    const openAdd = () => {
        setEditTarget(null);
        setDialogOpen(true);
    };

    const openEdit = (member) => {
        setEditTarget(member);
        setDialogOpen(true);
    };

    const handleSave = async (data) => {
        setSaving(true);
        try {
            // Check if the member being edited is actually the main user
            if (editTarget && editTarget.isMainUser) {
                // This calls axios.put("/auth/profile")
                await useUserStore.getState().updateProfile(data);
            } else if (editTarget) {
                // This calls axios.put("/user/family/:id")
                await updateFamilyMember(editTarget._id, data);
            } else {
                // This calls axios.post("/user/family")
                await addFamilyMember(data);
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setSaving(false);
            setDialogOpen(false);
        }
    };

    const handleDelete = async (memberId) => {
        setDeleting(memberId);
        await deleteFamilyMember(memberId);
        setDeleting(null);
    };

    return (
        <div className="min-h-screen bg-parchment pt-28 pb-20 px-4">
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    badge="Family Members"
                    title="My Family"
                    subtitle="Manage the people you book blessings for. Their details are remembered so each ceremony can be properly dedicated."
                    className="mb-8"
                />
                
                <div className="flex justify-center mb-10">
                    <Button onClick={openAdd} className="gap-2 rounded-xl px-6">
                        <UserPlus size={15} />
                        Add Member
                    </Button>
                </div>

                {displayList.length > 0 && (
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Users size={12} />
                        {displayList.length} member{displayList.length !== 1 ? "s" : ""}
                    </p>
                )}

                {displayList.length === 0 ? (
                    <EmptyState onAdd={openAdd} />
                ) : (
                    <div className="space-y-3">
                        {displayList.map((m) => (
                            <MemberCard
                                key={m._id}
                                member={m}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                deleting={deleting}
                            />
                        ))}
                    </div>
                )}

                {displayList.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-border text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Ready to book a blessing for someone?
                        </p>
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline underline-offset-4"
                        >
                            Explore Temple Services
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                )}
            </div>

            <MemberDialog
                open={dialogOpen}
                onOpenChange={(v) => {
                    setDialogOpen(v);
                    if (!v) setEditTarget(null);
                }}
                initial={editTarget}
                onSave={handleSave}
                saving={saving}
            />
        </div>
    );
};

export default FamilyPage;