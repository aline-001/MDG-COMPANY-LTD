'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import api from '../../../lib/api';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all orders
      const ordersRes = await api.get('/orders');
      const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data || [];

      // Fetch average rating
      const ratingRes = await api.get('/reviews/stats/average');
      const avgRating = ratingRes.data?.data?.average || 0;

      // Fetch reviews
      const reviewsRes = await api.get('/reviews?take=100');
      const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : reviewsRes.data.data || [];

      // Calculate stats
      const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = allOrders.filter((o: any) => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
      const completedOrders = allOrders.filter((o: any) => o.status === 'COMPLETED').length;

      setStats({
        totalOrders: allOrders.length,
        pendingOrders,
        completedOrders,
        totalRevenue,
        averageRating: avgRating,
        totalReviews: reviews.length,
      });

      // Get recent 5 orders
      setOrders(allOrders.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      showNotification({
        title: 'Error',
        message: 'Failed to load dashboard data',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'READY_FOR_DELIVERY':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-navy mx-auto mb-4"></div>
          <p className="text-mdg-slate">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-mdg-navy">Admin Dashboard</h1>
            <p className="text-mdg-slate text-sm mt-1">Welcome back, {user?.email}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="p-3 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Settings size={24} className="text-mdg-navy" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Package size={24} />}
            label="Total Orders"
            value={stats?.totalOrders || 0}
            color="bg-blue-50 text-mdg-blue"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Pending Orders"
            value={stats?.pendingOrders || 0}
            color="bg-yellow-50 text-yellow-600"
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            label="Completed Orders"
            value={stats?.completedOrders || 0}
            color="bg-green-50 text-green-600"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Total Revenue"
            value={`${(stats?.totalRevenue || 0).toLocaleString()} RWF`}
            color="bg-mdg-lime/20 text-mdg-lime"
          />
        </div>

        {/* Reviews & Rating */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-black text-mdg-navy mb-6 flex items-center gap-2">
              <MessageSquare size={24} /> Customer Reviews
            </h2>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= Math.round(stats?.averageRating || 0)
                          ? 'text-mdg-lime text-3xl'
                          : 'text-gray-300 text-3xl'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-3xl font-black text-mdg-navy">{(stats?.averageRating || 0).toFixed(1)}/5</p>
                <p className="text-sm text-mdg-slate mt-2">{stats?.totalReviews} reviews</p>
              </div>
              <div className="flex-1 h-32 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-mdg-slate text-sm">Review distribution chart</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-mdg-navy to-mdg-blue text-white rounded-2xl p-8">
            <h3 className="text-lg font-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard/new-order')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all text-sm"
              >
                Create Order
              </button>
              <button
                onClick={() => navigate('/admin/services')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all text-sm"
              >
                Manage Services
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all text-sm"
              >
                View Users
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-black text-mdg-navy flex items-center gap-2">
              <Package size={24} /> Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-mdg-navy">Order</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-mdg-navy">Customer</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-mdg-navy">Amount</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-mdg-navy">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-mdg-navy">Date</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-mdg-navy">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="px-8 py-4 font-bold text-mdg-navy">{order.orderNumber}</td>
                      <td className="px-8 py-4 text-mdg-slate">
                        {order.user.firstName} {order.user.lastName}
                      </td>
                      <td className="px-8 py-4 font-bold text-mdg-navy">{order.totalAmount.toLocaleString()} RWF</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-mdg-slate">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4">
                        <button
                          onClick={() => navigate(`/dashboard/order/${order.id}`)}
                          className="text-mdg-blue font-bold hover:text-mdg-navy transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-mdg-slate">
                      <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`${color} rounded-2xl p-6 border border-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm uppercase tracking-widest">{label}</h3>
        {icon}
      </div>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
}
