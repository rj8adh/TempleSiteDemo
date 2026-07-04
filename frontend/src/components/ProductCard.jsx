import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
    const { user } = useUserStore();
    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add to cart", { id: "login" });
            return;
        }
        addToCart(product);
    };

    // Log to check if the URL is actually reaching this component
    console.log(`Product: ${product.name} | Image:`, product.image);

    return (
        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg'>
            {/* Image Container */}
            <div className='relative mx-3 mt-3 h-60 overflow-hidden rounded-xl bg-gray-700'>
                <img
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110'
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                        console.error("Image failed to load for:", product.name);
                        // Fallback to a clear placeholder if the URL is broken
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Missing";
                    }}
                />
                {/* Transparent overlay for slight depth */}
                <div className='absolute inset-0 bg-black/10 pointer-events-none' />
            </div>

            {/* Content */}
            <div className='mt-4 px-5 pb-5'>
                <h5 className='text-xl font-semibold tracking-tight text-white'>
                    {product.name}
                </h5>
                <div className='mt-2 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-3xl font-bold text-blue-400'>
                            ${product.price.toFixed(2)}
                        </span>
                    </p>
                </div>
                <button
                    onClick={handleAddToCart}
                    className='flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors'
                >
                    <ShoppingCart size={22} className='mr-2' />
                    Add to cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;