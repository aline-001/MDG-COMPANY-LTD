'use client';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, AlertCircle, Clock, CheckCircle, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import api from '../../lib/api';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  pickupDate: string;
  deliveryDate?: string;
}

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const previousOrderStatesRef = useRef<{ [key: number]: string }>({});

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        const orderList = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        // Check for status changes and show notifications
        orderList.forEach((order: any) => {
          const previousStatus = previousOrderStatesRef.current[order.id];
          if (previousStatus && previousStatus !== order.status) {
            showNotification({
              title: 'Order Updated',
              message: `Order #${order.orderNumber} is now ${order.status.replace(/_/g, ' ')}`,
              type: 'success',
            });
          }
          previousOrderStatesRef.current[order.id] = order.status;
        });
        
        setOrders(orderList);

        // Calculate stats
        setStats({
          total: orderList.length,
          pending: orderList.filter((o: any) => o.status === 'PENDING' || o.status === 'CONFIRMED').length,
          inProgress: orderList.filter((o: any) => o.status === 'IN_PROGRESS' || o.status === 'READY_FOR_PICKUP').length,
          completed: orderList.filter((o: any) => o.status === 'COMPLETED').length,
        });
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Poll for order updates every 15 seconds
    const interval = setInterval(fetchOrders, 15000);

    return () => clearInterval(interval);
  }, [showNotification]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return <Clock size={16} className="text-yellow-600" />;
      case 'IN_PROGRESS':
        return <Truck size={16} className="text-blue-600" />;
      case 'READY_FOR_PICKUP':
        return <AlertCircle size={16} className="text-purple-600" />;
      case 'COMPLETED':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'READY_FOR_PICKUP':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-mdg-navy tracking-tighter mb-2">
            Welcome Back, {user?.firstName || 'Guest'}!
          </h1>
          <p className="text-mdg-slate text-sm font-bold uppercase tracking-[0.2em]">Here's your order overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-mdg-slate uppercase">Total Orders</p>
              <AlertCircle className="text-mdg-slate" size={20} />
            </div>
            <p className="text-3xl font-black text-mdg-navy">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-mdg-slate uppercase">Pending Pickup</p>
              <Clock className="text-yellow-600" size={20} />
            </div>
            <p className="text-3xl font-black text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-mdg-slate uppercase">In Progress</p>
              <Truck className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-black text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-mdg-slate uppercase">Completed</p>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-black text-green-600">{stats.completed}</p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-black text-mdg-navy text-lg uppercase tracking-tight">Recent Orders</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-blue mx-auto mb-4"></div>
              <p className="text-mdg-slate">Loading your orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Pickup Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-mdg-slate tracking-widest">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-bold text-mdg-blue">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-mdg-slate">{new Date(order.pickupDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-mdg-navy">${order.total?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 text-sm text-mdg-slate">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-mdg-slate font-bold mb-4">No orders yet</p>
              <button
                onClick={() => navigate('/dashboard/new-order')}
                className="inline-flex items-center gap-2 bg-mdg-blue text-white font-bold px-6 py-3 rounded-xl hover:bg-mdg-navy transition-all"
              >
                Create Your First Order <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* CTA Button */}
        {orders.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard/new-order')}
              className="inline-flex items-center gap-2 bg-mdg-blue text-white font-black px-8 py-4 rounded-2xl hover:bg-mdg-navy transition-all text-lg uppercase tracking-wider"
            >
              Create New Order <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}