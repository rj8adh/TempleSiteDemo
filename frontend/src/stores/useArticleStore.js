import { create } from "zustand";
import { databases, storage, DATABASE_ID, ARTICLE_COLLECTION_ID, STORAGE_BUCKET_ID } from "../appwrite"; // Added storage import
import { ID } from "appwrite";
import { toast } from "react-hot-toast";

export const useArticleStore = create((set) => ({
    articles: [],
    loading: false,

    fetchAllArticles: async () => {
        set({ loading: true });
        try {
            const response = await databases.listDocuments(DATABASE_ID, ARTICLE_COLLECTION_ID);

            const formattedArticles = response.documents.map(doc => ({
                ...doc,
                _id: doc.$id
            }));

            set({ articles: formattedArticles, loading: false });
        } catch (error) {
            set({ articles: [], loading: false });
            console.error("Failed to load articles:", error);
        }
    },

    // Updated to accept an optional raw imageFile object from your admin form
    createArticle: async (data, imageFile) => {
        set({ loading: true });
        try {
            let imageUrl = data.image || "";

            // 1. Upload to Appwrite Storage bucket if a file is attached
            if (imageFile) {
                const uploadedFile = await storage.createFile(
                    STORAGE_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                imageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
            }

            // 2. Create collection document using the final public URL string
            const newDoc = await databases.createDocument(
                DATABASE_ID,
                ARTICLE_COLLECTION_ID,
                ID.unique(),
                {
                    title: data.title?.trim(),
                    content: data.content?.trim(),
                    image: imageUrl,
                    // If you have optional attributes like category or readTime, add them here!
                }
            );

            const formattedArticle = { ...newDoc, _id: newDoc.$id };

            set((state) => ({
                articles: [...state.articles, formattedArticle],
                loading: false
            }));
            toast.success("Article published!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to publish");
        }
    },

    // Updated to accept an optional replacement raw imageFile object
    updateArticle: async (id, data, imageFile) => {
        set({ loading: true });
        try {
            let imageUrl = data.image;

            // 1. Upload to Appwrite Storage bucket if a new replacement file is passed
            if (imageFile) {
                const uploadedFile = await storage.createFile(
                    STORAGE_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                imageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
            }

            const updates = {
                title: data.title?.trim(),
                content: data.content?.trim(),
                image: imageUrl
            };

            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                ARTICLE_COLLECTION_ID,
                id,
                updates
            );

            const formattedArticle = { ...updatedDoc, _id: updatedDoc.$id };

            set((state) => ({
                articles: state.articles.map((a) => (a._id === id ? formattedArticle : a)),
                loading: false,
            }));
            toast.success("Article updated!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to update");
        }
    },

    deleteArticle: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, ARTICLE_COLLECTION_ID, id);
            set((state) => ({
                articles: state.articles.filter((a) => a._id !== id)
            }));
            toast.success("Article deleted");
        } catch (error) {
            toast.error(error.message || "Failed to delete");
        }
    },
}));