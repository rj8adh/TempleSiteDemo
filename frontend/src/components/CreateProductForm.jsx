import { useState, useEffect } from "react";
import { PlusCircle, Upload, Loader, Save } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const CreateProductForm = ({ editingItem, onFinished }) => {
    const [newProduct, setNewProduct] = useState(editingItem || {
        name: "",
        description: "",
        price: "",
        image: "",
    });
    const [imageFile, setImageFile] = useState(null); // Added raw file tracker

    const { createProduct, updateProduct, loading } = useProductStore();

    useEffect(() => {
        if (editingItem) {
            setNewProduct(editingItem);
            setImageFile(null); // Reset file selection on edit change
        }
    }, [editingItem]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // 1. Save raw file for the Appwrite store

            // 2. Keep reader strictly for instant UI display preview text
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Normalize ID checking for Appwrite document setups
            const itemId = editingItem?._id || editingItem?.$id;

            if (editingItem) {
                // Pass raw imageFile as the 3rd parameter
                await updateProduct(itemId, newProduct, imageFile);
            } else {
                // Pass raw imageFile as the 2nd parameter
                await createProduct(newProduct, imageFile);
            }
            setNewProduct({ name: "", description: "", price: "", image: "" });
            setImageFile(null);
            if (onFinished) onFinished();
        } catch (error) {
            console.log("error processing product", error);
        }
    };

    return (
        <div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-6 text-emerald-400'>
                {editingItem ? "Edit Service" : "Create New Service"}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-300'>Product Name</label>
                    <input
                        type='text'
                        id='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-300'>Description</label>
                    <textarea
                        id='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows='3'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-300'>Price</label>
                    <input
                        type='number'
                        id='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.01'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        required
                    />
                </div>

                <div className='mt-1 flex items-center'>
                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label htmlFor='image' className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500'>
                        <Upload className='h-5 w-5 inline-block mr-2' /> Upload Image
                    </label>
                    {(imageFile || newProduct.image) && (
                        <span className='ml-3 text-sm text-emerald-400 font-medium'>Image Ready!</span>
                    )}
                </div>

                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors'
                    disabled={loading}
                >
                    {loading ? (
                        <><Loader className='mr-2 h-5 w-5 animate-spin' />Processing...</>
                    ) : (
                        <>
                            {editingItem ? <Save className='mr-2 h-5 w-5' /> : <PlusCircle className='mr-2 h-5 w-5' />}
                            {editingItem ? "Update Product" : "Create Product"}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateProductForm;