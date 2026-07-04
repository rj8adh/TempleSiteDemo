import { useState, useEffect } from "react";
import { useEventStore } from "../stores/useEventStore";
import { PlusCircle, Loader, Save } from "lucide-react";

const CreateEventForm = ({ editingItem, onFinished }) => {
    const [formData, setFormData] = useState(editingItem || {
        title: "", description: "", date: "", time: "", location: "", category: "Festival", image: ""
    });
    const [imageFile, setImageFile] = useState(null); // Added raw file tracker

    const { addEvent, updateEvent, loading } = useEventStore();

    useEffect(() => {
        if (editingItem) {
            setFormData(editingItem);
            setImageFile(null);
        }
    }, [editingItem]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file); // Save raw file object for processing

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((f) => ({ ...f, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const itemId = editingItem?._id || editingItem?.$id;

        if (editingItem) {
            await updateEvent(itemId, formData, imageFile);
        } else {
            await addEvent(formData, imageFile);
        }

        setFormData({ title: "", description: "", date: "", time: "", location: "", category: "Festival", image: "" });
        setImageFile(null);
        if (onFinished) onFinished();
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700'>
            <h2 className='text-xl font-semibold text-blue-400 mb-4'>
                {editingItem ? "Edit Event" : "Add New Event"}
            </h2>
            <input type='text' placeholder='Event Title' className='w-full p-2 rounded bg-gray-700 text-white'
                value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />

            <div className='p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-900/50 flex flex-col items-center gap-3'>
                {formData.image && (
                    <div className='w-32 h-32 rounded overflow-hidden border border-blue-500'>
                        <img src={formData.image} alt='Preview' className='w-full h-full object-cover' />
                    </div>
                )}
                <label className='cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 transition'>
                    <PlusCircle size={18} />
                    <span>{formData.image ? "Change Event Image" : "Upload Event Image"}</span>
                    <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleImageChange}
                    />
                </label>
                <p className='text-xs text-gray-400'>Recommended: Square or Landscape (PNG, JPG)</p>
            </div>

            <textarea placeholder='Description' className='w-full p-2 rounded bg-gray-700 text-white'
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <div className='grid grid-cols-2 gap-4'>
                <input type='text' placeholder='Date (e.g. Oct 24)' className='p-2 rounded bg-gray-700 text-white'
                    value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                <input type='text' placeholder='Time' className='p-2 rounded bg-gray-700 text-white'
                    value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
            </div>
            <input type='text' placeholder='Location' className='w-full p-2 rounded bg-gray-700 text-white'
                value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />

            <button type='submit' disabled={loading} className='w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-bold transition'>
                {loading ? (
                    <Loader className='animate-spin' />
                ) : (
                    <>
                        {editingItem ? <Save className='mr-2' size={18} /> : <PlusCircle className='mr-2' size={18} />}
                        {editingItem ? "Update Event" : "Add Event"}
                    </>
                )}
            </button>
        </form>
    );
};

export default CreateEventForm;