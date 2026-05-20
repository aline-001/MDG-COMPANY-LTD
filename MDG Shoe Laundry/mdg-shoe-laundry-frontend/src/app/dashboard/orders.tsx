'use client';
import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import api from '../../lib/api';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  pickupDate: string;
  deliveryDate?: string;
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
        setOrders(orderList);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        showNotification({
          title: 'Error',
          message: 'Failed to load order history',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showNotification]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'CONFIRMED':
      case 'IN_PROGRESS':
        return <Clock className="text-blue-500" size={20} />;
      case 'READY_FOR_PICKUP':
        return <Truck className="text-green-500" size={20} />;
      case 'COMPLETED':
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'READY_FOR_PICKUP':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-mdg-navy mb-2">Order History</h1>
          <p className="text-mdg-slate">Track and manage all your orders</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-navy mx-auto"></div>
            <p className="mt-4 text-mdg-slate">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-gray-200">
            <AlertCircle size={48} className="mx-auto text-mdg-slate/40 mb-4" />
            <p className="text-mdg-slate font-bold text-lg">No orders yet</p>
            <p className="text-mdg-slate/60 mt-2">Create your first order to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-mdg-blue transition-all flex items-center justify-between"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStatusIcon(order.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-mdg-navy">{order.orderNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-mdg-slate/70">
                      <div>
                        <p className="text-xs font-bold uppercase mb-1">Created</p>
                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase mb-1">Pickup Date</p>
                        <p className="font-semibold">{new Date(order.pickupDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-mdg-slate/60 font-bold uppercase mb-1">Amount</p>
                  <p className="text-2xl font-black text-mdg-navy">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
