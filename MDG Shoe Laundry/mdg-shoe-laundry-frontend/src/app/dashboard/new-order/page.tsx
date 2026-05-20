'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import { useNotification } from '../../../contexts/NotificationContext';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

interface OrderItem {
  serviceId: number;
  quantity: number;
}

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data.data || res.data || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services');
        showNotification({
          title: 'Error',
          message: 'Failed to load services',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [showNotification]);

  const addService = (serviceId: number) => {
    const existing = orderItems.find(item => item.serviceId === serviceId);
    if (existing) {
      setOrderItems(orderItems.map(item =>
        item.serviceId === serviceId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { serviceId, quantity: 1 }]);
    }
  };

  const removeService = (serviceId: number) => {
    setOrderItems(orderItems.filter(item => item.serviceId !== serviceId));
  };

  const getServiceName = (serviceId: number) => {
    return services.find(s => s.id === serviceId)?.name || 'Unknown Service';
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => {
      const service = services.find(s => s.id === item.serviceId);
      return total + (service?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (orderItems.length === 0) {
      setError('Please add at least one service');
      showNotification({
        title: 'Error',
        message: 'Please add at least one service',
        type: 'error',
      });
      return;
    }

    if (!pickupDate) {
      setError('Please select a pickup date');
      showNotification({
        title: 'Error',
        message: 'Please select a pickup date',
        type: 'error',
      });
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        pickupDate: new Date(pickupDate).toISOString(),
        deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : null,
        notes,
        orderServices: orderItems.map(item => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
        })),
      };

      await api.post('/orders', orderData);
      
      showNotification({
        title: 'Success',
        message: 'Order created successfully!',
        type: 'success',
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      const errorMsg = err.response?.data?.message || 'Failed to create order';
      setError(errorMsg);
      showNotification({
        title: 'Error',
        message: errorMsg,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-mdg-navy" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-mdg-navy">Create New Order</h1>
            <p className="text-mdg-slate font-medium">Select services and provide details</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Services */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-mdg-navy mb-6">Available Services</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-blue mx-auto mb-4"></div>
                  <p className="text-mdg-slate">Loading services...</p>
                </div>
              ) : services.length > 0 ? (
                <div className="grid gap-4">
                  {services.map(service => (
                    <div key={service.id} className="border border-gray-100 rounded-2xl p-6 hover:border-mdg-blue transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-mdg-navy">{service.name}</h3>
                          <p className="text-sm text-mdg-slate mt-1">{service.description}</p>
                        </div>
                        <button
                          onClick={() => addService(service.id)}
                          className="bg-mdg-blue text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-mdg-navy transition-all"
                        >
                          <Plus size={18} /> Add
                        </button>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-mdg-slate font-bold">Price: <span className="text-mdg-navy font-black">${service.price.toFixed(2)}</span></span>
                        <span className="text-mdg-slate font-bold">Est. Days: <span className="text-mdg-navy font-black">{service.estimatedDays}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-mdg-slate">
                  <p className="font-bold">No services available</p>
                </div>
              )
              }
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-mdg-navy mb-6">Order Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-mdg-navy uppercase mb-2 block">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mdg-blue outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-mdg-navy uppercase mb-2 block">Delivery Date (Optional)</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mdg-blue outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-mdg-navy uppercase mb-2 block">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={submitting}
                    placeholder="Any special instructions for your order..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mdg-blue outline-none resize-none disabled:opacity-50"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || orderItems.length === 0}
                  className="w-full py-4 bg-mdg-navy text-white rounded-xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed lg:hidden"
                >
                  {submitting ? 'Creating Order...' : 'Confirm & Create Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-mdg-navy rounded-[32px] p-8 text-white h-fit sticky top-8">
            <h2 className="text-xl font-black mb-6">Order Summary</h2>

            {orderItems.length > 0 ? (
              <>
                <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
                  {orderItems.map(item => {
                    const service = services.find(s => s.id === item.serviceId);
                    return (
                      <div key={item.serviceId} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{getServiceName(item.serviceId)}</p>
                          <p className="text-xs text-gray-400">x{item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">${((service?.price || 0) * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeService(item.serviceId)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (10%)</span>
                    <span className="font-bold">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t border-white/10 pt-4">
                    <span className="font-black">Total</span>
                    <span className="font-black">${(getTotalPrice() * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-8 py-4 bg-mdg-blue rounded-xl font-black uppercase tracking-widest hover:bg-white hover:text-mdg-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed hidden lg:block"
                >
                  {submitting ? '⏳ Creating...' : '✅ Confirm Order'}
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto mb-4 text-yellow-400" size={32} />
                <p className="text-gray-300 font-bold text-lg">No Services Selected</p>
                <p className="text-xs text-gray-400 mt-2">← Add services from the left to create an order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}