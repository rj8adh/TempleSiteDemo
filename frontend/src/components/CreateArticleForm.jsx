import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Loader, Type, Link, Save, Upload } from "lucide-react";
import { useArticleStore } from "../stores/useArticleStore";

const CreateArticleForm = ({ editingItem, onFinished }) => {
    const [newArticle, setNewArticle] = useState(editingItem || {
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        readTime: "",
        category: "Culture",
        image: "",
    });
    const [imageFile, setImageFile] = useState(null); // Added raw file tracker

    const { createArticle, updateArticle, loading } = useArticleStore();

    useEffect(() => {
        if (editingItem) {
            setNewArticle(editingItem);
            setImageFile(null);
        }
    }, [editingItem]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file); // Store raw input file for bucket streaming

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewArticle((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const itemId = editingItem?._id || editingItem?.$id;

            if (editingItem) {
                await updateArticle(itemId, newArticle, imageFile);
            } else {
                await createArticle(newArticle, imageFile);
            }

            if (!editingItem) {
                setNewArticle({ title: "", slug: "", content: "", excerpt: "", readTime: "", category: "Culture", image: "" });
            }
            setImageFile(null);
            if (onFinished) onFinished();
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        setNewArticle({ ...newArticle, title, slug });
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-orange-400'>
                {editingItem ? "Edit Article" : "Create New Article"}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Title */}
                <div>
                    <label className='block text-sm font-medium text-gray-300'>Article Title</label>
                    <div className='mt-1 relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Type className='h-5 w-5 text-gray-500' />
                        </div>
                        <input
                            type='text'
                            required
                            value={newArticle.title}
                            onChange={handleTitleChange}
                            className='block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-white'
                        />
                    </div>
                </div>

                {/* Featured Image */}
                <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-300'>Featured Image</label>
                    <div className='flex items-center gap-4 p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-900/30'>
                        {newArticle.image && (
                            <div className='w-20 h-20 rounded overflow-hidden border border-orange-500 shrink-0'>
                                <img src={newArticle.image} alt='Preview' className='w-full h-full object-cover' />
                            </div>
                        )}
                        <label
                            htmlFor='art-img'
                            className='cursor-pointer flex items-center justify-center gap-2 flex-1 p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-500 transition'
                        >
                            <Upload size={18} />
                            <span className="text-sm font-medium">
                                {newArticle.image ? "Change Image" : "Upload Image"}
                            </span>
                        </label>
                        <input id='art-img' type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                    </div>
                </div>

                {/* Slug */}
                <div>
                    <label className='block text-sm font-medium text-gray-300'>Slug (URL path)</label>
                    <div className='mt-1 relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Link className='h-5 w-5 text-gray-500' />
                        </div>
                        <input
                            type='text'
                            readOnly
                            value={newArticle.slug}
                            className='block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-400 cursor-not-allowed'
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label className='block text-sm font-medium text-gray-300'>Excerpt</label>
                    <textarea
                        required
                        value={newArticle.excerpt}
                        onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                        rows='2'
                        className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500'
                    />
                </div>

                {/* Content */}
                <div>
                    <label className='block text-sm font-medium text-gray-300'>Content (HTML)</label>
                    <textarea
                        required
                        value={newArticle.content}
                        onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                        rows='6'
                        className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500 font-mono text-sm'
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Read Time</label>
                        <input
                            type='text'
                            placeholder="e.g. 5 min"
                            value={newArticle.readTime}
                            onChange={(e) => setNewArticle({ ...newArticle, readTime: e.target.value })}
                            className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Category</label>
                        <select
                            value={newArticle.category}
                            onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                            className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white'
                        >
                            <option value="Culture">Culture</option>
                            <option value="History">History</option>
                            <option value="Tradition">Tradition</option>
                        </select>
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors'
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' />
                            {editingItem ? "Updating..." : "Publishing..."}
                        </>
                    ) : (
                        <>
                            {editingItem ? <Save className='mr-2 h-5 w-5' /> : <PlusCircle className='mr-2 h-5 w-5' />}
                            {editingItem ? "Update Article" : "Publish Article"}
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default CreateArticleForm;