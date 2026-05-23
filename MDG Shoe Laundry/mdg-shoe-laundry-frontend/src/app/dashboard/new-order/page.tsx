'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Brush, Sparkles, Zap, Sun, Gift, ShoppingBag, Backpack, Briefcase, Package, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import { useNotification } from '../../../contexts/NotificationContext';

interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  quantity: number;
  quantityLabel: string;
}

function getServiceIcon(name: string) {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Regular Cleaning': Brush,
    'Medium Cleaning': Sparkles,
    'Extreme Cleaning': Zap,
    'Unyellowing Treatment': Sun,
    'Twin Deal Bundle': Gift,
    'Leather Bags': ShoppingBag,
    'Canvas Bags': Backpack,
    'Lace Bags': Briefcase,
    'Other Bag Types': Package,
  };
  return iconMap[name] || Package;
}

type OrderCategory = 'SHOES' | 'BAG' | null;

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [category, setCategory] = useState<OrderCategory>(null);
  const [selectedServices, setSelectedServices] = useState<{ serviceId: number; quantity: number }[]>([]);
  const [pickupDate, setPickupDate] = useState('');
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
        const allServices = res.data.data || res.data || [];
        setServices(allServices);
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

  // Filter services by category
  const categoryServices = category 
    ? services.filter(s => s.category === category)
    : [];

  // Get selected services with their details
  const selectedServiceDetails = selectedServices
    .map(sel => {
      const svc = services.find(s => s.id === sel.serviceId);
      return svc ? { ...svc, selectedQuantity: sel.quantity } : null;
    })
    .filter(Boolean);

  // Calculate total price
  const totalPrice = selectedServiceDetails.reduce((total, svc) => {
    if (!svc) return total;
    // For Twin Deal (2 pairs), price is flat 1500
    if (svc.quantity === 2 && svc.category === 'SHOES') {
      return total + svc.basePrice;
    }
    // For other services, multiply base price by quantity
    return total + (svc.basePrice * svc.selectedQuantity);
  }, 0);

  const handleAddService = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    // For bags and Twin Deal, quantity is fixed
    if (service.category === 'BAG' || service.quantity === 2) {
      const existing = selectedServices.find(s => s.serviceId === serviceId);
      if (existing) {
        setSelectedServices(selectedServices.map(s =>
          s.serviceId === serviceId
            ? { ...s, quantity: s.quantity + 1 }
            : s
        ));
      } else {
        setSelectedServices([...selectedServices, { serviceId, quantity: 1 }]);
      }
    } else {
      // For single pair shoes, allow quantity selection
      const existing = selectedServices.find(s => s.serviceId === serviceId);
      if (existing) {
        setSelectedServices(selectedServices.map(s =>
          s.serviceId === serviceId
            ? { ...s, quantity: s.quantity + 1 }
            : s
        ));
      } else {
        setSelectedServices([...selectedServices, { serviceId, quantity: 1 }]);
      }
    }
  };

  const handleRemoveService = (serviceId: number) => {
    setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
  };

  const handleIncreaseQuantity = (serviceId: number) => {
    setSelectedServices(selectedServices.map(s =>
      s.serviceId === serviceId
        ? { ...s, quantity: s.quantity + 1 }
        : s
    ));
  };

  const handleDecreaseQuantity = (serviceId: number) => {
    setSelectedServices(selectedServices.map(s =>
      s.serviceId === serviceId && s.quantity > 1
        ? { ...s, quantity: s.quantity - 1 }
        : s
    ).filter(s => s.quantity > 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!category) {
      setError('Please select a category (Shoes or Bag)');
      showNotification({
        title: 'Error',
        message: 'Please select a category',
        type: 'error',
      });
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      showNotification({
        title: 'Error',
        message: 'Please select at least one service',
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
        pickupLocation: 'MDG Laundry Center',
        pickupDate: new Date(pickupDate).toISOString(),
        notes,
        itemType: category, // SHOES or BAG
        totalAmount: totalPrice,
        serviceIds: selectedServices.map(s => s.serviceId),
      };

      const response = await api.post('/orders', orderData);
      
      showNotification({
        title: 'Success',
        message: `Order #${response.data?.orderNumber} created successfully!`,
        type: 'success',
      });
      
      // Redirect to order tracking page with the order ID
      if (response.data?.id) {
        setTimeout(() => {
          navigate(`/dashboard/order/${response.data.id}`);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
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
      <div className="max-w-6xl mx-auto">
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
            <p className="text-mdg-slate font-medium">Shoe Laundry & Bag Washing Services</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Selection */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-mdg-navy mb-6">What Would You Like to Clean?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shoes Category */}
                <button
                  type="button"
                  onClick={() => {
                    setCategory('SHOES');
                    setSelectedServices([]);
                  }}
                  className={`p-8 rounded-2xl border-2 transition-all text-center ${
                    category === 'SHOES'
                      ? 'border-mdg-blue bg-blue-50'
                      : 'border-gray-200 hover:border-mdg-blue'
                  }`}
                >
                  <Sparkles size={64} className="text-mdg-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-mdg-navy">Shoe Laundry</h3>
                  <p className="text-sm text-mdg-slate mt-2">
                    Professional cleaning for all shoe types. Single pair or twin deal!
                  </p>
                  {category === 'SHOES' && (
                    <div className="mt-4 inline-flex items-center gap-2 text-mdg-blue font-bold">
                      <Check size={20} /> Selected
                    </div>
                  )}
                </button>

                {/* Bags Category */}
                <button
                  type="button"
                  onClick={() => {
                    setCategory('BAG');
                    setSelectedServices([]);
                  }}
                  className={`p-8 rounded-2xl border-2 transition-all text-center ${
                    category === 'BAG'
                      ? 'border-mdg-blue bg-blue-50'
                      : 'border-gray-200 hover:border-mdg-blue'
                  }`}
                >
                  <Backpack size={64} className="text-mdg-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-mdg-navy">Bag Cleaning</h3>
                  <p className="text-sm text-mdg-slate mt-2">
                    Expert cleaning for leather, canvas, lace & more! 25% cash back offer!
                  </p>
                  {category === 'BAG' && (
                    <div className="mt-4 inline-flex items-center gap-2 text-mdg-blue font-bold">
                      <Check size={20} /> Selected
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Services Selection */}
            {category && (
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-black text-mdg-navy mb-6">
                  {category === 'SHOES' ? 'Select Cleaning Service' : 'Select Bag Type'}
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-blue mx-auto mb-4"></div>
                    <p className="text-mdg-slate">Loading services...</p>
                  </div>
                ) : categoryServices.length > 0 ? (
                  <div className="grid gap-4">
                    {categoryServices.map(service => {
                      const IconComponent = getServiceIcon(service.name);
                      return (
                        <div
                          key={service.id}
                          className="border border-gray-200 rounded-2xl p-6 hover:border-mdg-blue transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-black text-mdg-navy">{service.name}</h3>
                              <p className="text-sm text-mdg-slate mt-2">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-mdg-navy">{service.basePrice.toLocaleString()} RWF</p>
                              <p className="text-xs text-mdg-slate mt-1">{service.quantityLabel}</p>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            type="button"
                            onClick={() => handleAddService(service.id)}
                            className="mt-4 w-full py-2 bg-mdg-navy text-white rounded-xl font-bold hover:bg-[rgb(8,22,40)] transition-all"
                          >
                            Add to Order
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-mdg-slate">
                    <p className="font-bold">No services available</p>
                  </div>
                )}
              </div>
            )}

            {/* Order Details */}
            {category && (
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 space-y-6">
                <h2 className="text-xl font-black text-mdg-navy">Order Details</h2>

                <div>
                  <label className="text-sm font-bold text-mdg-navy uppercase mb-2 block">Pickup Date *</label>
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
                  <label className="text-sm font-bold text-mdg-navy uppercase mb-2 block">Additional Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={submitting}
                    placeholder="Any special instructions? (e.g., shoe color, material, condition, bag type, special requests)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mdg-blue outline-none resize-none disabled:opacity-50"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || selectedServices.length === 0}
                  className="w-full py-4 bg-mdg-navy text-white rounded-xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating Order...' : 'Confirm & Create Order'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {category && (
            <div className="bg-mdg-navy rounded-[32px] p-8 text-white h-fit sticky top-8">
              <h2 className="text-xl font-black mb-6">Order Summary</h2>

              {selectedServices.length > 0 ? (
                <>
                  <div className="space-y-4 mb-8 pb-8 border-b border-white/20 max-h-96 overflow-y-auto">
                    {selectedServiceDetails.map(item => {
                      if (!item) return null;
                      const isTwinDeal = item.quantity === 2 && item.category === 'SHOES';
                      const itemPrice = isTwinDeal ? item.basePrice : item.basePrice * item.selectedQuantity;

                      return (
                        <div key={item.id} className="bg-white/10 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <p className="font-bold text-sm">{item.name}</p>
                              {!isTwinDeal && (
                                <p className="text-xs text-gray-300 mt-1">
                                  {item.basePrice.toLocaleString()} RWF × {item.selectedQuantity} = {itemPrice.toLocaleString()} RWF
                                </p>
                              )}
                              {isTwinDeal && (
                                <p className="text-xs text-gray-300 mt-1">
                                  {item.quantity} pairs = {itemPrice.toLocaleString()} RWF
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQuantity(item.id)}
                              className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-all"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 bg-white/20 rounded text-sm font-bold flex-1 text-center">
                              {item.selectedQuantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncreaseQuantity(item.id)}
                              className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition-all"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveService(item.id)}
                              className="px-3 py-1 bg-red-600/50 text-red-200 rounded text-sm hover:bg-red-600 transition-all font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="font-bold">{totalPrice.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between text-lg border-t border-white/20 pt-3">
                      <span className="font-black">Total</span>
                      <span className="font-black text-mdg-lime">{totalPrice.toLocaleString()} RWF</span>
                    </div>
                    {category === 'BAG' && (
                      <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mt-4">
                        <p className="text-xs text-yellow-300">
                          <strong>Special Offer:</strong> Get 25% cash back on bag cleaning!
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-300 font-bold text-lg mb-2">No Services Added</p>
                  <p className="text-xs text-gray-400">
                    Select and add services above to create an order
                  </p>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}