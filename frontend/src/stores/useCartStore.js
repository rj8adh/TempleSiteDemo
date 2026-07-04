import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { databases, DATABASE_ID, CART_COLLECTION_ID, ORDER_COLLECTION_ID } from "../appwrite";
import { ID, Query } from "appwrite";
import { toast } from "react-hot-toast";

const safeArr = (v) => (Array.isArray(v) ? v : []);

function makeCartItemId(productId, recipientName) {
    return `${productId}__${recipientName ?? ""}`;
}

function totalQuantityForProduct(cart, productId, excludeCartItemId = null) {
    return safeArr(cart)
        .filter((i) => i._id === productId && i.cartItemId !== excludeCartItemId)
        .reduce((sum, i) => sum + i.quantity, 0);
}

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            total: 0,
            subtotal: 0,
            coupon: null,
            isCouponApplied: false,
            allOrders: [],
            loading: false,

            // 1. FETCH + SMART-MERGE CART
            getCartItems: async () => {
                try {
                    const { useUserStore } = await import("./useUserStore");
                    const currentUser = useUserStore.getState().user;
                    if (!currentUser) return get().calculateTotals();

                    // Query Appwrite for documents belonging to this individual user
                    const res = await databases.listDocuments(
                        DATABASE_ID,
                        CART_COLLECTION_ID,
                        [Query.equal("userID", currentUser._id)]
                    );

                    const backendItems = safeArr(res.documents).map(doc => ({
                        _id: doc.productID,
                        appwriteDocId: doc.$id,
                        quantity: doc.quantity
                    }));

                    const current = safeArr(get().cart);
                    const mergedCart = [];
                    const seenIds = new Set();

                    // Keep local items that still match items found in the database
                    for (const item of current) {
                        const backendMatch = backendItems.find((b) => b._id === item._id);
                        if (backendMatch) {
                            mergedCart.push({
                                ...item,
                                appwriteDocId: backendMatch.appwriteDocId
                            });
                            seenIds.add(item._id);
                        }
                    }

                    // Add database items added from other devices
                    for (const bItem of backendItems) {
                        if (!seenIds.has(bItem._id)) {
                            mergedCart.push({
                                ...bItem,
                                cartItemId: makeCartItemId(bItem._id, ""),
                                recipient: null,
                            });
                        }
                    }

                    set({ cart: mergedCart });
                    get().calculateTotals();
                } catch (error) {
                    const status = error?.code || error?.response?.status;
                    if (status !== 401 && status !== 403) {
                        console.error("Cart fetch failed:", error);
                    }

                    get().calculateTotals();
                }
            },

            resetCart: () => {
                set({ cart: [], total: 0, subtotal: 0, coupon: null, isCouponApplied: false });
            },

            // 2. ADD TO CART
            addToCart: async (product, recipient = null) => {
                if (!recipient?.name?.trim()) {
                    toast.error("Please select who this blessing is for.");
                    return;
                }
                try {
                    const { useUserStore } = await import("./useUserStore");
                    const currentUser = useUserStore.getState().user;

                    let appwriteDocId = null;
                    if (currentUser) {
                        // Create persistent document on Appwrite
                        const newDoc = await databases.createDocument(
                            DATABASE_ID,
                            CART_COLLECTION_ID,
                            ID.unique(),
                            {
                                userID: currentUser._id,
                                productID: product._id,
                                quantity: 1
                            }
                        );
                        appwriteDocId = newDoc.$id;
                    }

                    set((state) => {
                        const recipientName = recipient.name.trim();
                        const cartItemId = makeCartItemId(product._id, recipientName);

                        const baseCart = safeArr(state.cart).filter(
                            (i) => i._id !== product._id || i.recipient?.name
                        );
                        const existing = baseCart.find((i) => i.cartItemId === cartItemId);

                        const newCart = existing
                            ? baseCart.map((i) =>
                                i.cartItemId === cartItemId
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            )
                            : [...baseCart, {
                                ...product,
                                quantity: 1,
                                recipient: { ...recipient, name: recipientName },
                                cartItemId,
                                appwriteDocId
                            }];

                        return { cart: newCart };
                    });

                    get().calculateTotals();
                } catch (error) {
                    toast.error(error.message || "Failed to add to cart");
                }
            },

            // 3. REMOVE A LINE ITEM
            removeFromCart: async (cartItemId) => {
                try {
                    const cart = safeArr(get().cart);
                    const item = cart.find((i) => i.cartItemId === cartItemId);
                    if (!item) return;

                    if (item.appwriteDocId) {
                        await databases.deleteDocument(DATABASE_ID, CART_COLLECTION_ID, item.appwriteDocId);
                    }

                    set((state) => ({
                        cart: safeArr(state.cart).filter((i) => i.cartItemId !== cartItemId),
                    }));
                    get().calculateTotals();
                } catch (error) {
                    get().calculateTotals();
                }
            },

            updateRecipientDetails: (cartItemId, newRecipientData) => {
                set((state) => ({
                    cart: safeArr(state.cart).map((item) =>
                        item.cartItemId === cartItemId
                            ? { ...item, recipient: { ...item.recipient, ...newRecipientData } }
                            : item
                    ),
                }));
            },

            // 4. UPDATE QUANTITY
            updateQuantity: async (cartItemId, quantity) => {
                if (quantity <= 0) return get().removeFromCart(cartItemId);

                try {
                    const cart = safeArr(get().cart);
                    const item = cart.find((i) => i.cartItemId === cartItemId);
                    if (!item) return;

                    if (item.appwriteDocId) {
                        await databases.updateDocument(
                            DATABASE_ID,
                            CART_COLLECTION_ID,
                            item.appwriteDocId,
                            { quantity: quantity }
                        );
                    }

                    set((state) => ({
                        cart: safeArr(state.cart).map((i) =>
                            i.cartItemId === cartItemId ? { ...i, quantity } : i
                        ),
                    }));
                    get().calculateTotals();
                } catch (error) {
                    get().calculateTotals();
                }
            },

            calculateTotals: () => {
                const { coupon } = get();
                const cart = safeArr(get().cart);
                const subtotal = cart.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0);
                let total = subtotal;
                if (coupon) {
                    total = subtotal - (subtotal * coupon.discountPercentage) / 100;
                }
                set({ subtotal, total: parseFloat(total.toFixed(2)) });
            },

            // 5. CLEAR CART
            clearCart: async () => {
                const cart = safeArr(get().cart);
                set({ cart: [], total: 0, subtotal: 0, coupon: null, isCouponApplied: false });

                try {
                    // Loop and empty everything cleanly via document tracking references
                    for (const item of cart) {
                        if (item.appwriteDocId) {
                            await databases.deleteDocument(DATABASE_ID, CART_COLLECTION_ID, item.appwriteDocId);
                        }
                    }
                } catch (error) {
                    console.error("Error clearing cart from server:", error);
                }
            },

            // 6. PROCESS ZELLE / CHECKOUT ACTIONS
            processZelleOrder: async ({ additionalNote, pujaDate }) => {
                set({ loading: true });
                try {
                    const { total } = get();
                    const cart = safeArr(get().cart);
                    const { useUserStore } = await import("./useUserStore");
                    const currentUser = useUserStore.getState().user;

                    // Serialize products array to save cleanly into your string array parameters
                    const productStringifications = cart.map((item) => JSON.stringify({
                        productID: item._id,
                        quantity: item.quantity,
                        price: item.price,
                        recipient: item.recipient,
                    }));

                    const newOrder = await databases.createDocument(
                        DATABASE_ID,
                        ORDER_COLLECTION_ID,
                        ID.unique(),
                        {
                            userID: currentUser?._id || "guest",
                            products: productStringifications,
                            totalAmount: total, // Your custom configured float parameter
                            status: "pending",
                            additionalNote: additionalNote || "",
                            pujaDate: pujaDate || ""
                        }
                    );

                    await get().clearCart();
                    window.location.href = `/purchase-success?orderId=${newOrder.$id}&method=zelle`;
                } catch (error) {
                    toast.error("Failed to process booking.");
                } finally {
                    set({ loading: false });
                }
            },

            // ── Admin Functions ──────────────────────────────────────────────────

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
                }
            },

            updateOrderStatus: async (orderId, newStatus) => {
                try {
                    const res = await databases.updateDocument(
                        DATABASE_ID,
                        ORDER_COLLECTION_ID,
                        orderId,
                        { status: newStatus }
                    );
                    set((state) => ({
                        allOrders: state.allOrders.map((order) =>
                            order._id === orderId ? { ...order, status: res.status } : order
                        ),
                    }));
                    toast.success("Order status updated");
                } catch (error) {
                    toast.error("Failed to update status");
                }
            },

            syncCartOnLogin: async () => {
                const cart = safeArr(get().cart);
                if (cart.length === 0) return;
                try {
                    const { useUserStore } = await import("./useUserStore");
                    const currentUser = useUserStore.getState().user;
                    if (!currentUser) return;

                    for (const item of cart) {
                        const newDoc = await databases.createDocument(
                            DATABASE_ID,
                            CART_COLLECTION_ID,
                            ID.unique(),
                            {
                                userID: currentUser._id,
                                productID: item._id,
                                quantity: item.quantity
                            }
                        );
                        item.appwriteDocId = newDoc.$id;
                    }
                } catch (error) {
                    console.error("Sync failed:", error);
                }
            },
        }),
        {
            name: "temple-cart-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cart: safeArr(state.cart) }),
            onRehydrateStorage: () => (state) => {
                if (state && !Array.isArray(state.cart)) {
                    state.cart = [];
                }
            },
        }
    )
);