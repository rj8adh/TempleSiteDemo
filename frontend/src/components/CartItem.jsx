import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
    // We pull the actions we need from the REAL store
    const { removeFromCart, updateQuantity } = useCartStore();

    return (
        <div className='rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm md:p-6'>
            <div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
                {/* Product Image */}
                <div className='shrink-0 md:order-1'>
                    <img className='h-20 w-20 rounded object-cover' src={item.image} alt={item.name} />
                </div>

                {/* Quantity Controls */}
                <div className='flex items-center justify-between md:order-3 md:justify-end'>
                    <div className='flex items-center gap-2'>
                        <button
                            className='inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600'
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                            <Minus className='text-gray-300' size={14} />
                        </button>
                        <p className='text-white'>{item.quantity}</p>
                        <button
                            className='inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600'
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                            <Plus className='text-gray-300' size={14} />
                        </button>
                    </div>

                    <div className='text-end md:ml-4'>
                        <p className='text-base font-bold text-blue-400'>
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Product Name and Remove Button */}
                <div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
                    <p className='text-base font-medium text-white hover:text-blue-400 hover:underline'>
                        {item.name}
                    </p>
                    <div className='flex items-center gap-4'>
                        <button
                            type='button'
                            className='inline-flex items-center text-sm font-medium text-red-500 hover:text-red-700'
                            onClick={() => removeFromCart(item._id)}
                        >
                            <Trash size={16} className='mr-1' />
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;