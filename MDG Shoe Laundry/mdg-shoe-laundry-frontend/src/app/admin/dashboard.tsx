'use client';
import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Clock, Truck, AlertCircle, TrendingUp, DollarSign, Users, Settings, Eye, BarChart3, Filter, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import api from '../../lib/api';

interface Order {
  id: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
  totalAmount?: number;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  userId?: number;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
}

type TabType = 'overview' | 'orders' | 'services' | 'users' | 'reports';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeCustomers: 0,
    averageOrderValue: 0,
  });
  const previousOrderCountRef = useRef(0);

  // Fetch all orders from NestJS /api/orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        const orderList = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        // Check if new orders were added
        if (previousOrderCountRef.current > 0 && orderList.length > previousOrderCountRef.current) {
          showNotification({
            title: '🚀 New Order Alert!',
            message: `${orderList.length - previousOrderCountRef.current} new order(s) received!`,
            type: 'success',
          });
        }
        
        previousOrderCountRef.current = orderList.length;
        setOrders(orderList);
        
        // Calculate stats
        const totalRevenue = orderList.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
        const pendingOrders = orderList.filter((o: any) => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
        const completedOrders = orderList.filter((o: any) => o.status === 'COMPLETED').length;
        const uniqueCustomers = new Set(orderList.map((o: any) => o.userId)).size;
        
        setStats({
          totalRevenue,
          totalOrders: orderList.length,
          pendingOrders,
          completedOrders,
          activeCustomers: uniqueCustomers,
          averageOrderValue: orderList.length > 0 ? totalRevenue / orderList.length : 0,
        });
      } catch (err) {
        console.error('Failed to fetch orders', err);
        showNotification({
          title: 'Error',
          message: 'Failed to load orders',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [showNotification]);

  const updateOrderStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      setOrders(orders.map((o) => o.id === id ? { ...o, status: newStatus as any } : o));
      
      showNotification({
        title: '✅ Success',
        message: `Order status updated to ${newStatus}`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to update order', err);
      showNotification({
        title: '❌ Error',
        message: 'Failed to update order status',
        type: 'error',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
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
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const adminTabs = [
    { id: 'overview' as TabType, label: '📊 Overview', icon: BarChart3 },
    { id: 'orders' as TabType, label: '📦 Orders', icon: Truck },
    { id: 'services' as TabType, label: '⚙️ Services', icon: Settings },
    { id: 'users' as TabType, label: '👥 Users', icon: Users },
    { id: 'reports' as TabType, label: '📈 Reports', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-mdg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between max-w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mdg-navy rounded-xl flex items-center justify-center font-black text-white">
                A
              </div>
              <div>
                <h1 className="font-black text-mdg-navy">MDG ADMIN</h1>
                <p className="text-[10px] text-mdg-slate font-bold">Control Center</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-mdg-navy text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-mdg-slate font-bold uppercase">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-64 h-[calc(100vh-73px)] bg-mdg-navy text-white overflow-y-auto transition-transform duration-300 z-30`}>
          <nav className="p-6 space-y-2">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-mdg-blue text-white shadow-lg shadow-mdg-blue/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-black text-mdg-navy mb-2">BUSINESS DASHBOARD</h1>
                <p className="text-mdg-slate font-bold uppercase">Real-time analytics and insights</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border-2 border-mdg-blue/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-mdg-slate uppercase">Total Revenue</h3>
                    <DollarSign className="text-mdg-blue" size={24} />
                  </div>
                  <p className="text-4xl font-black text-mdg-navy">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-[10px] text-mdg-slate mt-2 font-bold">From all orders</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-mdg-slate uppercase">Total Orders</h3>
                    <AlertCircle className="text-yellow-600" size={24} />
                  </div>
                  <p className="text-4xl font-black text-yellow-600">{stats.totalOrders}</p>
                  <p className="text-[10px] text-mdg-slate mt-2 font-bold">{stats.pendingOrders} pending</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-mdg-slate uppercase">Completed</h3>
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <p className="text-4xl font-black text-green-600">{stats.completedOrders}</p>
                  <p className="text-[10px] text-mdg-slate mt-2 font-bold">Success rate: {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-mdg-slate uppercase">Active Customers</h3>
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <p className="text-4xl font-black text-blue-600">{stats.activeCustomers}</p>
                  <p className="text-[10px] text-mdg-slate mt-2 font-bold">Unique customers</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-mdg-slate uppercase">Avg Order Value</h3>
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <p className="text-4xl font-black text-purple-600">${stats.averageOrderValue.toFixed(2)}</p>
                  <p className="text-[10px] text-mdg-slate mt-2 font-bold">Per order</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-mdg-slate uppercase">Pending Orders</h3>
                    <Clock className="text-orange-600" size={24} />
                  </div>
                  <p className="text-4xl font-black text-orange-600">{stats.pendingOrders}</p>
                  <p className="text-[10px] text-mdg-slate mt-2 font-bold">Awaiting processing</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-mdg-navy mb-1">ORDER MANAGEMENT</h1>
                  <p className="text-mdg-slate font-bold">Manage all customer orders</p>
                </div>
                <button className="bg-mdg-blue text-white px-6 py-3 rounded-xl font-black uppercase text-sm hover:bg-mdg-navy transition-colors flex items-center gap-2">
                  <Filter size={16} /> Filter
                </button>
              </div>

              <div className="bg-white rounded-[40px] overflow-hidden border-2 border-gray-100">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-blue mx-auto mb-4"></div>
                    <p className="text-mdg-slate font-bold">Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-mdg-background border-b-2 border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-mdg-slate tracking-widest">Order</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-mdg-slate tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-mdg-slate tracking-widest">Status</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-mdg-slate tracking-widest">Created</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-mdg-slate tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-mdg-background/50 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-mdg-blue">#{order.orderNumber}</td>
                            <td className="px-6 py-4 font-bold text-mdg-navy">${(order.totalAmount || 0).toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-mdg-slate">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <select 
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="bg-mdg-background border border-gray-300 rounded-lg px-3 py-1 text-[10px] font-bold uppercase outline-none focus:ring-2 ring-mdg-blue cursor-pointer"
                                defaultValue={order.status}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="READY_FOR_PICKUP">Ready</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancel</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-mdg-slate">
                    <p className="font-bold text-lg">No orders found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-mdg-navy mb-1">SERVICES MANAGEMENT</h1>
                  <p className="text-mdg-slate font-bold">Manage laundry services and pricing</p>
                </div>
              </div>
              <div className="bg-white rounded-[40px] p-12 border-2 border-gray-100 text-center">
                <p className="text-mdg-slate font-bold text-lg">Services management coming soon...</p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-mdg-navy mb-1">USER MANAGEMENT</h1>
                  <p className="text-mdg-slate font-bold">Manage customers and staff</p>
                </div>
              </div>
              <div className="bg-white rounded-[40px] p-12 border-2 border-gray-100 text-center">
                <p className="text-mdg-slate font-bold text-lg">User management coming soon...</p>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-mdg-navy mb-1">BUSINESS REPORTS</h1>
                  <p className="text-mdg-slate font-bold">View analytics and generate reports</p>
                </div>
              </div>
              <div className="bg-white rounded-[40px] p-12 border-2 border-gray-100 text-center">
                <p className="text-mdg-slate font-bold text-lg">Reports coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}