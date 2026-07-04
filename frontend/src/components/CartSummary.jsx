import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight, Loader } from "lucide-react"; // Added Loader
import { useState } from "react";

const CartSummary = () => {
    // Pull values and the checkout function from the store
    const { total = 0, subtotal = 0, coupon, isCouponApplied, cart: rawCart, processZelleOrder } = useCartStore();
    const cart = Array.isArray(rawCart) ? rawCart : [];

    // Add local state for the loading/processing feedback
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate savings and format numbers safely
    const savings = Number(subtotal) - Number(total);
    const formattedSubtotal = Number(subtotal).toFixed(2);
    const formattedTotal = Number(total).toFixed(2);
    const formattedSavings = Number(savings).toFixed(2);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            await processZelleOrder({ additionalNote: "", pujaDate: "" });
        } catch (error) {
            setIsProcessing(false);
            // The store likely already shows a toast error, but we reset the button here
        }
    };

    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className='text-xl font-semibold text-blue-400'>Order Summary</p>

            <div className='space-y-4'>
                <div className='space-y-2'>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-300'>Original price</dt>
                        <dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
                    </dl>

                    {savings > 0 && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Savings</dt>
                            <dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
                        </dl>
                    )}

                    {coupon && isCouponApplied && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
                            <dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
                        </dl>
                    )}

                    <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
                        <dt className='text-base font-bold text-white'>Total</dt>
                        <dd className='text-base font-bold text-blue-400'>${formattedTotal}</dd>
                    </dl>
                </div>

                <motion.button
                    className='flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={isProcessing || cart.length === 0}
                >
                    {isProcessing ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' />
                            Recording Booking...
                        </>
                    ) : (
                        "Place Booking"
                    )}
                </motion.button>

                <div className='flex items-center justify-center gap-2'>
                    <span className='text-sm font-normal text-gray-400'>or</span>
                    <Link
                        to='/services'
                        className='inline-flex items-center text-sm font-medium text-blue-400 underline hover:text-blue-300 hover:no-underline'
                    >
                        Continue Shopping
                        <MoveRight className='ml-1' size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CartSummary;