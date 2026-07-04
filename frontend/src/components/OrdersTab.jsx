import { motion } from "framer-motion";
import { User, Search, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const OrdersTab = ({ orders, updateOrderStatus }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter logic: search by User Name, Recipient Name, or Order ID
    const filteredOrders = orders.filter((order) => {
        const orderId = `ORDER-${order._id.slice(-6).toUpperCase()}`;
        const userName = order.user?.name?.toLowerCase() || "";
        const recipientName = order.products?.[0]?.recipient?.name?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        return orderId.toLowerCase().includes(search) || 
               userName.includes(search) || 
               recipientName.includes(search);
    });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Memo copied to clipboard");
    };

    if (!orders || orders.length === 0) {
        return <div className='text-center py-10 text-gray-400'>No orders found.</div>;
    }

    return (
        <div className="space-y-4">
            {/* ─── Search Bar ─── */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by Memo ID, Customer, or Blessing Name..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl'
            >
                <div className="overflow-x-auto">
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead className='bg-gray-900/50'>
                            <tr>
                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Zelle Memo</th>
                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Details</th>
                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Amount</th>
                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Status</th>
                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-700 bg-gray-800/50'>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className="flex items-center gap-2">
                                                <span className='font-mono text-sm font-bold text-primary'>
                                                    ORDER-{order._id.slice(-6).toUpperCase()}
                                                </span>
                                                <button 
                                                    onClick={() => copyToClipboard(`ORDER-${order._id.slice(-6).toUpperCase()}`)}
                                                    className="text-gray-500 hover:text-white transition-colors"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </td>

                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-white">{order.user?.name || "Guest"}</span>
                                                <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <CheckCircle2 size={10} className="text-primary" />
                                                    Blessing for: <span className="text-gray-300 font-medium">{order.products?.[0]?.recipient?.name || "Self"}</span>
                                                </span>
                                            </div>
                                        </td>

                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-medium'>
                                            ${order.totalAmount.toFixed(2)}
                                        </td>

                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                                                order.status === "completed" 
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                    : order.status === "processing"
                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className='bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 border border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer'
                                            >
                                                <option value='pending'>Pending</option>
                                                <option value='processing'>Paid (Zelle Rec'd)</option>
                                                <option value='completed'>Completed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                                        No results matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default OrdersTab;