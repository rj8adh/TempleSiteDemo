import { create } from "zustand";
import { databases, storage, DATABASE_ID, EVENT_COLLECTION_ID, STORAGE_BUCKET_ID } from "../appwrite"; // Added storage import
import { ID } from "appwrite";
import { toast } from "react-hot-toast";

export const useEventStore = create((set) => ({
    events: [],
    loading: false,

    fetchEvents: async () => {
        set({ loading: true });
        try {
            const response = await databases.listDocuments(DATABASE_ID, EVENT_COLLECTION_ID);

            const formattedEvents = response.documents.map(doc => ({
                ...doc,
                _id: doc.$id
            }));

            set({ events: formattedEvents, loading: false });
        } catch (error) {
            set({ events: [], loading: false });
            console.error("Failed to load events:", error);
        }
    },

    // Updated to handle time, location, and an optional raw imageFile
    addEvent: async (eventData, imageFile) => {
        set({ loading: true });
        try {
            let imageUrl = eventData.image || "";

            // 1. Upload to Appwrite Storage if a file is attached
            if (imageFile) {
                const uploadedFile = await storage.createFile(
                    STORAGE_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                imageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
            }

            // 2. Create the document matching your active layout properties
            const newDoc = await databases.createDocument(
                DATABASE_ID,
                EVENT_COLLECTION_ID,
                ID.unique(),
                {
                    title: eventData.title?.trim(),
                    description: eventData.description?.trim() || "",
                    date: eventData.date || "",
                    time: eventData.time || "",         // Added to match Admin Table
                    location: eventData.location || "", // Added to match Admin Table
                    image: imageUrl
                }
            );

            const formattedEvent = { ...newDoc, _id: newDoc.$id };

            set((state) => ({
                events: [...state.events, formattedEvent],
                loading: false
            }));
            toast.success("Event added successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to add event");
        }
    },

    removeEvent: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, EVENT_COLLECTION_ID, id);
            set((state) => ({ events: state.events.filter(e => e._id !== id) }));
            toast.success("Event removed");
        } catch (error) {
            toast.error(error.message || "Failed to remove event");
        }
    },

    // Updated to safely sync changes for time, location, and image replacements
    updateEvent: async (id, eventData, imageFile) => {
        set({ loading: true });
        try {
            let imageUrl = eventData.image;

            if (imageFile) {
                const uploadedFile = await storage.createFile(
                    STORAGE_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                imageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
            }

            const updates = {
                title: eventData.title?.trim(),
                description: eventData.description?.trim(),
                date: eventData.date,
                time: eventData.time,
                location: eventData.location,
                image: imageUrl
            };

            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                EVENT_COLLECTION_ID,
                id,
                updates
            );

            const formattedEvent = { ...updatedDoc, _id: updatedDoc.$id };

            set((state) => ({
                events: state.events.map((e) => (e._id === id ? formattedEvent : e)),
                loading: false,
            }));
            toast.success("Event updated successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.message || "Failed to update event");
        }
    },
}));