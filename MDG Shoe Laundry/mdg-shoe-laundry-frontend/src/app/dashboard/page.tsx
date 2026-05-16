'use client';
import React from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Package
} from 'lucide-react';
// FIX: Import from react-router-dom instead of next/link
import { Link } from 'react-router-dom';

const stats = [
  { label: "Total Orders", value: "12", icon: <Package size={20} />, color: "bg-blue-50 text-mdg-blue" },
  { label: "Pending Pickup", value: "2", icon: <Clock size={20} />, color: "bg-yellow-50 text-yellow-600" },
  { label: "In Progress", value: "1", icon: <TrendingUp size={20} />, color: "bg-mdg-lime/10 text-mdg-navy" },
  { label: "Completed", value: "9", icon: <CheckCircle size={20} />, color: "bg-green-50 text-green-600" },
];

const recentOrders = [
  { id: "MDG-8821", item: "Nike Air Max", service: "Extreme Clean", status: "IN_PROGRESS", date: "May 14, 2026", price: "1500 RWF" },
  { id: "MDG-8819", item: "Canvas Backpack", service: "Bag Laundry", status: "PENDING", date: "May 13, 2026", price: "1200 RWF" },
  { id: "MDG-8790", item: "Adidas Forum", service: "Regular Clean", status: "COMPLETED", date: "May 10, 2026", price: "800 RWF" },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-mdg-navy">Dashboard</h1>
          <p className="text-mdg-slate font-medium">Welcome back to MDG Empire</p>
        </div>
        {/* FIX: Use 'to' instead of 'href' */}
        <Link 
          to="/dashboard/new-order" 
          className="bg-mdg-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-mdg-navy transition-all shadow-lg shadow-mdg-blue/20 w-fit"
        >
          <Plus size={20} /> New Order
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-mdg-slate uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-mdg-navy">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-black text-mdg-navy text-lg uppercase tracking-tight">Recent Activity</h2>
            {/* FIX: Use 'to' instead of 'href' */}
            <Link to="/dashboard/orders" className="text-sm font-bold text-mdg-blue hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-mdg-background">
                  <th className="px-6 py-4 text-xs font-bold text-mdg-navy uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-mdg-navy uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-mdg-navy uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-mdg-navy uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-mdg-navy">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-mdg-navy">{order.item}</p>
                      <p className="text-[10px] text-mdg-slate font-medium uppercase">{order.service}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-mdg-navy">{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loyalty/Empire Progress Card */}
        <div className="bg-mdg-navy rounded-[32px] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Empire Loyalty</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              You are <span className="text-mdg-lime font-bold">1 order away</span> from your next 25% Cashback reward.
            </p>
            
            {/* Progress Bar */}
            <div className="h-3 w-full bg-white/10 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-mdg-blue w-3/4 rounded-full" />
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-mdg-lime text-mdg-navy p-2 rounded-lg font-black text-xs">NEW</div>
                <p className="text-xs font-bold">Bag Laundry services now available in Bumbogo!</p>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-mdg-blue rounded-xl font-black text-sm hover:bg-white hover:text-mdg-navy transition-all flex items-center justify-center gap-2">
              Learn More <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-mdg-blue/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}