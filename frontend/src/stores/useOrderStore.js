import { create } from "zustand";
import { databases, DATABASE_ID, ORDER_COLLECTION_ID } from "../appwrite";
import { Query } from "appwrite";
import { toast } from "react-hot-toast";

const safeArr = (v) => (Array.isArray(v) ? v : []);

export const useOrderStore = create((set) => ({
    orders: [], // Personal orders for the logged-in user
    allOrders: [], // All orders for the Admin dashboard
    loading: false,

    // FETCH USER'S PERSONAL ORDERS
    fetchMyOrders: async () => {
        set({ loading: true });
        try {
            const { useUserStore } = await import("./useUserStore");
            const currentUser = useUserStore.getState().user;
            if (!currentUser) return set({ orders: [], loading: false });

            const res = await databases.listDocuments(
                DATABASE_ID,
                ORDER_COLLECTION_ID,
                [Query.equal("userID", currentUser._id)]
            );

            const formattedOrders = res.documents.map(doc => ({
                ...doc,
                _id: doc.$id,
                // Parse stringified products back into objects for your lists
                products: safeArr(doc.products).map(p => JSON.parse(p))
            }));

            set({ orders: formattedOrders, loading: false });
        } catch (error) {
            set({ orders: [], loading: false });
            toast.error(error.message || "Failed to fetch your orders");
        }
    },

    // FETCH ALL ORDERS (Admin Only)
    fetchAllOrders: async () => {
        set({ loading: true });
        try {
            const res = await databases.listDocuments(DATABASE_ID, ORDER_COLLECTION_ID);

            const formattedOrders = res.documents.map(doc => ({
                ...doc,
                _id: doc.$id,
                products: safeArr(doc.products).map(p => JSON.parse(p))
            }));

            set({ allOrders: formattedOrders, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to fetch all orders");
        }
    },

    // UPDATE ORDER STATUS (Admin Only)
    updateOrderStatus: async (orderId, newStatus) => {
        try {
            const res = await databases.updateDocument(
                DATABASE_ID,
                ORDER_COLLECTION_ID,
                orderId,
                { status: newStatus }
            );

            // Update local state immediately
            set((state) => ({
                allOrders: state.allOrders.map((order) =>
                    order._id === orderId ? { ...order, status: res.status } : order
                ),
                // Update personal orders list too if this user happens to view it
                orders: state.orders.map((order) =>
                    order._id === orderId ? { ...order, status: res.status } : order
                ),
            }));

            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            toast.error(error.message || "Failed to update status");
        }
    },
}));