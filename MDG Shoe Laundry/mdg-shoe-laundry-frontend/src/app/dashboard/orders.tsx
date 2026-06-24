'use client';
import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Truck, AlertCircle, X } from 'lucide-react';
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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
        const payload = res.data?.orders ?? res.data?.data ?? res.data;
        const orderList = Array.isArray(payload) ? payload : [];
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

  // Filter and search orders
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toString().includes(searchQuery)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

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
      <div className="max-w-6xl pt-10 md:pt-12">
        <div className="mb-8 mt-8 md:mt-10">
          <h1 className="text-3xl font-black text-mdg-navy mb-2">Order History</h1>
          <p className="text-mdg-slate">Track and manage all your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-bold text-mdg-slate/60 mb-2">Search Order</label>
              <input
                type="text"
                placeholder="Search by order number or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mdg-blue focus:outline-none font-semibold"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-mdg-slate/60 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mdg-blue focus:outline-none font-semibold bg-white"
              >
                <option value="ALL">All Orders</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="mt-4 flex items-center gap-2 text-mdg-blue hover:text-mdg-navy font-bold text-sm transition-colors"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-navy mx-auto"></div>
            <p className="mt-4 text-mdg-slate">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-gray-200">
            <AlertCircle size={48} className="mx-auto text-mdg-slate/40 mb-4" />
            <p className="text-mdg-slate font-bold text-lg">
              {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
            </p>
            <p className="text-mdg-slate/60 mt-2">
              {orders.length === 0
                ? 'Create your first order to get started'
                : 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-mdg-slate/60 font-bold text-sm mb-4">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate(`/dashboard/order/${order.id}`)}
                className="w-full bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-mdg-blue transition-all flex items-center justify-between cursor-pointer text-left"
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
                  <p className="text-2xl font-black text-mdg-navy">{(order.totalAmount || 0).toLocaleString()} RWF</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
