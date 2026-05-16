'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Truck, MoreVertical } from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all orders from NestJS /api/orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to sync with backend", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2. Update Status (Syncs with Prisma Order model status field)
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}`, { status: newStatus });
      // Refresh local state to reflect the "collabo"
      setOrders(orders.map((o: any) => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="bg-mdg-background min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-mdg-navy tracking-tighter">BUMBOGO <span className="text-mdg-blue">CONTROL.</span></h1>
            <p className="text-mdg-slate text-xs font-bold uppercase tracking-[0.2em] mt-2">Managing {orders.length} Active Restorations</p>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Order ID</th>
                <th className="p-6 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Client</th>
                <th className="p-6 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-mdg-slate tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-mono text-xs font-bold text-mdg-blue">#{order.id.slice(-8)}</td>
                  <td className="p-6">
                    <p className="font-bold text-mdg-navy">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{order.shoe?.type || 'Standard Care'}</p>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                      order.status === 'CLEANING' ? 'bg-blue-100 text-blue-600' : 'bg-mdg-lime text-mdg-navy'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <select 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-mdg-background border border-gray-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 ring-mdg-blue"
                      defaultValue={order.status}
                    >
                      <option value="PENDING">Set Pending</option>
                      <option value="CLEANING">Start Cleaning</option>
                      <option value="DELIVERED">Mark Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}