import { create } from "zustand";
import { account, databases, OAuthProvider, DATABASE_ID, FAMILY_COLLECTION_ID, APP_ORIGIN } from "../appwrite";
import { ID, Query } from "appwrite";
import { toast } from "react-hot-toast";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAuthStatus = async () => {
    const sessionUser = await account.get();
    const prefs = await account.getPrefs();

    return {
        _id: sessionUser.$id,
        name: sessionUser.name,
        email: sessionUser.email,
        role: prefs.role || "customer",
        gotra: prefs.gotra || "",
        rashi: prefs.rashi || "",
        birthday: prefs.birthday || null,
        family: []
    };
};

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    // Replaces getProfile and protectRoute cookie verification loops
    checkAuth: async () => {
        set({ checkingAuth: true });

        // Safari/Firefox/mobile can be slightly behind after OAuth redirect.
        // Retry a few times before treating user as logged out.
        const delays = [0, 150, 350, 700];

        for (let i = 0; i < delays.length; i++) {
            if (delays[i] > 0) await wait(delays[i]);

            try {
                const hydratedUser = await getAuthStatus();
                set({
                    user: hydratedUser,
                    checkingAuth: false,
                    loading: false
                });
                return;
            } catch (error) {
                const status = error?.code || error?.response?.status;
                const isLastAttempt = i === delays.length - 1;

                if (!isLastAttempt && (status === 401 || status === 403)) {
                    continue;
                }

                if (isLastAttempt) {
                    set({ checkingAuth: false, loading: false, user: null });
                }
            }
        }
    },

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }
        try {
            // 1. Create native Appwrite authentication record
            const userId = ID.unique();
            await account.create(userId, email, password, name);

            // 2. Automatically create a session (logs them in right away)
            await account.createEmailPasswordSession(email, password);

            // 3. Attach default user profile preferences securely
            await account.updatePrefs({
                role: "customer",
                gotra: "",
                rashi: "",
                birthday: null
            });

            toast.success("Account created successfully!");
            await get().checkAuth();
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "An error occurred during signup");
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            const { useCartStore } = await import("./useCartStore");
            const rawGuest = useCartStore.getState().cart;
            const guestItems = Array.isArray(rawGuest) ? [...rawGuest] : [];

            // Authenticate directly with Appwrite Cloud
            await account.createEmailPasswordSession(email, password);

            useCartStore.setState({ cart: guestItems });

            // Syncing cart logic to the server side table (we'll implement this next)
            // for (const item of guestItems) { ... }

            await get().checkAuth();
            toast.success("Logged in successfully!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Invalid email or password");
        }
    },

    loginWithGoogle: () => {
        // Keep redirects on a single canonical origin to prevent cookie/session mismatches
        // across browsers (especially Safari/Firefox and mobile webviews).
        const successUrl = `${APP_ORIGIN}/auth/callback`;
        const failureUrl = `${APP_ORIGIN}/login?error=google_failed`;

        // Direct handling of OAuth redirects handled natively by Appwrite edge locations
        account.createOAuth2Session(
            OAuthProvider.Google,
            successUrl,
            failureUrl
        );
    },

    logout: async () => {
        try {
            // Wipes the current session token instantly across all browser layers
            await account.deleteSession('current');
            set({ user: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    },

    updateProfile: async ({ name, birthday, gotra, rashi }) => {
        set({ loading: true });
        try {
            // Update name natively if passed
            if (name) await account.updateName(name.trim());

            // Update remaining custom fields in user metadata preferences
            const currentPrefs = await account.getPrefs();
            const newPrefs = { ...currentPrefs };
            if (birthday !== undefined) newPrefs.birthday = birthday;
            if (gotra !== undefined) newPrefs.gotra = gotra.trim();
            if (rashi !== undefined) newPrefs.rashi = rashi.trim();

            await account.updatePrefs(newPrefs);
            toast.success("Profile updated");
            await get().checkAuth();
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to update profile");
        }
    },

    // ─── Refactored Relational Family CRUD ───────────────────────────────────

    fetchFamilyMembers: async () => {
        const currentUser = get().user;
        if (!currentUser) return;
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                FAMILY_COLLECTION_ID,
                [Query.equal("userID", currentUser._id)]
            );
            set((state) => ({
                user: state.user ? { ...state.user, family: res.documents } : state.user,
            }));
        } catch (error) {
            const status = error?.code || error?.response?.status;
            if (status === 401 || status === 403) {
                set((state) => ({
                    user: state.user ? { ...state.user, family: [] } : state.user,
                }));
                return;
            }

            console.error("Failed to fetch family members:", error);
        }
    },

    addFamilyMember: async (member) => {
        const currentUser = get().user;
        try {
            const newMemberDoc = await databases.createDocument(
                DATABASE_ID,
                FAMILY_COLLECTION_ID,
                ID.unique(),
                {
                    userID: currentUser._id,
                    name: member.name.trim(),
                    relationship: member.relationship,
                    birthday: member.birthday || null,
                    gotra: member.gotra?.trim() || "",
                    rashi: member.rashi?.trim() || "",
                }
            );
            await get().fetchFamilyMembers();
            toast.success(`${member.name} added to your family`);
            return newMemberDoc;
        } catch (error) {
            toast.error(error.message || "Failed to add family member");
            return null;
        }
    },

    updateFamilyMember: async (memberId, data) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                FAMILY_COLLECTION_ID,
                memberId,
                data
            );
            await get().fetchFamilyMembers();
            toast.success("Family member updated");
        } catch (error) {
            toast.error(error.message || "Failed to update family member");
        }
    },

    deleteFamilyMember: async (memberId) => {
        try {
            await databases.deleteDocument(DATABASE_ID, FAMILY_COLLECTION_ID, memberId);
            await get().fetchFamilyMembers();
            toast.success("Family member removed");
        } catch (error) {
            toast.error(error.message || "Failed to remove family member");
        }
    },

    deleteAccount: async () => {
        set({ loading: true });
        try {
            // Wipes the native auth record entirely out of your cloud project 
            await account.delete();
            const { useCartStore } = await import("./useCartStore");
            useCartStore.getState().resetCart();
            set({ user: null, loading: false });
            toast.success("Account deleted.");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to delete account");
            throw error;
        }
    },
}));
