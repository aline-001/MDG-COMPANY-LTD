'use client';
import { useState } from 'react';
import { Package, Search, Loader2 } from 'lucide-react';
import api from '../../lib/api'; // Ensure this matches your API client path

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!orderId) return;
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      // Connects to your NestJS Order model via the /api/orders/:id path
      const response = await api.get(`/orders/${orderId}`);
      setOrderData(response.data);
    } catch (err) {
      setError('Order not found. Please check your ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mdg-navy min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-[40px] p-12 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-mdg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="text-mdg-blue" size={32} />
          </div>
          <h1 className="text-3xl font-black text-mdg-navy tracking-tighter mb-2">TRACK YOUR GEAR</h1>
          <p className="text-mdg-slate text-sm font-medium">Enter your order ID to see the restoration status.</p>
        </div>

        <div className="relative group mb-8">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="MDG-0000-0000"
            className="w-full bg-mdg-background border-2 border-gray-100 rounded-2xl px-8 py-6 text-xl font-bold text-mdg-navy focus:border-mdg-blue outline-none transition-all"
          />
          <button 
            onClick={handleTrack}
            disabled={loading}
            className="absolute right-4 top-4 bottom-4 bg-mdg-navy text-white px-8 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-mdg-blue transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
          </button>
        </div>

        {/* Dynamic Status Result - Data from your Prisma Order model */}
        {orderData && (
          <div className="bg-mdg-background rounded-3xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-mdg-blue uppercase tracking-widest mb-1">Current Status</p>
                <h3 className="text-2xl font-black text-mdg-navy tracking-tighter uppercase">{orderData.status}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-mdg-slate uppercase tracking-widest mb-1">Customer</p>
                <p className="font-bold text-mdg-navy">{orderData.customerName}</p>
              </div>
            </div>

            {orderData.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-video mb-4">
                <img src={orderData.imageUrl} alt="Shoe Status" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs font-bold text-mdg-slate uppercase">
              <span className="w-2 h-2 rounded-full bg-mdg-lime animate-pulse"></span>
              Location: {orderData.pickupLocation}
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 font-bold text-sm mb-6">{error}</p>
        )}
        
        <div className="mt-8 p-6 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-center text-xs text-mdg-slate font-bold uppercase tracking-tighter">
            Need help? Contact Bumbogo Support: +250 795 015 780
          </p>
        </div>
      </div>
    </div>
  );
}