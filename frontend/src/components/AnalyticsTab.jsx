import { motion } from "framer-motion";
import { Users, Package, DollarSign, ShoppingCart } from "lucide-react";

const AnalyticsTab = () => {
    // Placeholder stats - in a real app, you'd fetch these from the backend
    const stats = [
        { label: "Total Users", value: "124", icon: Users, color: "from-blue-500 to-cyan-500" },
        { label: "Total Services", value: "12", icon: Package, color: "from-emerald-500 to-teal-500" },
        { label: "Total Sales", value: "$1,240", icon: DollarSign, color: "from-orange-500 to-amber-500" },
        { label: "Bookings", value: "48", icon: ShoppingCart, color: "from-pink-500 to-rose-500" },
    ];

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 relative overflow-hidden`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm font-medium text-gray-400 uppercase tracking-wider'>
                                    {stat.label}
                                </p>
                                <h3 className='mt-1 text-3xl font-bold text-white'>{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} opacity-80`}>
                                <stat.icon className='text-white' size={24} />
                            </div>
                        </div>
                        {/* Subtle background glow */}
                        <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${stat.color} blur-3xl opacity-10`} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                className='bg-gray-800/50 rounded-2xl p-8 border border-gray-700 text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className='text-xl font-semibold text-white mb-2'>Activity Graph</h3>
                <p className='text-gray-400 italic'>
                    Real-time charting will be integrated in Phase 2 using the backend analytics engine.
                </p>
            </motion.div>
        </div>
    );
};

export default AnalyticsTab;