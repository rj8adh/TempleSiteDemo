import { create } from "zustand";
import { databases, storage, DATABASE_ID, PRODUCT_COLLECTION_ID, STORAGE_BUCKET_ID } from "../appwrite"; // Added storage import
import { ID } from "appwrite";
import { toast } from "react-hot-toast";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await databases.listDocuments(DATABASE_ID, PRODUCT_COLLECTION_ID);

            const formattedProducts = response.documents.map(doc => ({
                ...doc,
                _id: doc.$id
            }));

            set({ products: formattedProducts, loading: false });
        } catch (error) {
            set({ products: [], loading: false });
            toast.error("Failed to fetch products");
        }
    },

    // Updated to handle an optional raw imageFile object from the form
    createProduct: async (productData, imageFile) => {
        set({ loading: true });
        try {
            let imageUrl = productData.image || "";

            // 1. Handle file upload to Appwrite Storage if a new file exists
            if (imageFile) {
                const uploadedFile = await storage.createFile(
                    STORAGE_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                // Get the direct public URL view string for the image
                imageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
            }

            // 2. Create the document with the final image URL string
            const newDoc = await databases.createDocument(
                DATABASE_ID,
                PRODUCT_COLLECTION_ID,
                ID.unique(),
                {
                    name: productData.name.trim(),
                    description: productData.description?.trim() || "",
                    price: parseFloat(productData.price),
                    category: productData.category,
                    isFeatured: productData.isFeatured || false,
                    image: imageUrl
                }
            );

            const formattedProduct = { ...newDoc, _id: newDoc.$id };

            set((prevState) => ({
                products: [...prevState.products, formattedProduct],
                loading: false,
            }));
            toast.success("Product created successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to create product");
        }
    },

    // Updated to handle an optional raw imageFile object for updates
    updateProduct: async (id, productData, imageFile) => {
        set({ loading: true });
        try {
            let imageUrl = productData.image;

            // 1. Handle file upload to Appwrite Storage if a replacement file is provided
            if (imageFile) {
                const uploadedFile = await storage.createFile(
                    STORAGE_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                imageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
            }

            const updates = {
                name: productData.name?.trim(),
                description: productData.description?.trim(),
                price: productData.price ? parseFloat(productData.price) : undefined,
                category: productData.category,
                isFeatured: productData.isFeatured,
                image: imageUrl
            };

            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                PRODUCT_COLLECTION_ID,
                id,
                updates
            );

            const formattedProduct = { ...updatedDoc, _id: updatedDoc.$id };

            set((state) => ({
                products: state.products.map((p) =>
                    p._id === id ? formattedProduct : p
                ),
                loading: false,
            }));
            toast.success("Product updated successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to update product");
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            await databases.deleteDocument(DATABASE_ID, PRODUCT_COLLECTION_ID, id);

            set((state) => ({
                products: state.products.filter((product) => product._id !== id),
                loading: false,
            }));
            toast.success("Product deleted successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to delete product");
        }
    },
}));