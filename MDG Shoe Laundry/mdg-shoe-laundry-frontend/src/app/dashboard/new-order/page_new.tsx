'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
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
  itemType: string;
  estimatedDays: number;
}

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
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

  const getSelectedService = () => services.find(s => s.id === selectedService);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedService) {
      setError('Please select a service (shoes or bag)');
      showNotification({
        title: 'Error',
        message: 'Please select a service',
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
      const selectedSvc = getSelectedService();
      const orderData = {
        pickupLocation: 'MDG Laundry Center',
        pickupDate: new Date(pickupDate).toISOString(),
        notes,
        itemType: selectedSvc?.itemType, // SHOES or BAG
        totalAmount: selectedSvc?.price || 0,
        serviceIds: [selectedService],
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
            <p className="text-mdg-slate font-medium">Select what you'd like to clean and provide details</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Selection */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-mdg-navy mb-6">What Would You Like to Clean?</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-blue mx-auto mb-4"></div>
                <p className="text-mdg-slate">Loading services...</p>
              </div>
            ) : services.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {services.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      selectedService === service.id
                        ? 'border-mdg-blue bg-blue-50'
                        : 'border-gray-200 hover:border-mdg-blue'
                    }`}
                  >
                    <div className="text-3xl mb-3">
                      {service.itemType === 'SHOES' ? '👟' : '👜'}
                    </div>
                    <h3 className="text-lg font-black text-mdg-navy">{service.name}</h3>
                    <p className="text-sm text-mdg-slate mt-2">{service.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-2xl font-black text-mdg-blue">{service.price.toLocaleString()} RWF</p>
                      <p className="text-xs text-mdg-slate mt-1">Est. {service.estimatedDays} days</p>
                    </div>
                    {selectedService === service.id && (
                      <div className="mt-4 text-mdg-blue font-bold">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-mdg-slate">
                <p className="font-bold">No services available at the moment</p>
              </div>
            )}
          </div>

          {/* Order Details */}
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
              <p className="text-xs text-mdg-slate mt-1">Select when you'd like to drop off your items</p>
            </div>

            <div>
              <label className="text-sm font-bold text-mdg-navy uppercase mb-2 block">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                placeholder="Any special instructions? (e.g., color of shoes, bag material, special cleaning requests)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mdg-blue outline-none resize-none disabled:opacity-50"
                rows={4}
              />
            </div>

            {/* Order Summary */}
            {selectedService && getSelectedService() && (
              <div className="bg-mdg-navy text-white rounded-2xl p-6 space-y-4">
                <h3 className="font-black text-lg">Order Summary</h3>
                <div className="space-y-2 pb-4 border-b border-white/20">
                  <div className="flex justify-between">
                    <span className="font-bold">{getSelectedService()?.name}</span>
                    <span className="font-black">{getSelectedService()?.price.toLocaleString()} RWF</span>
                  </div>
                </div>
                <div className="flex justify-between text-xl">
                  <span className="font-black">Total:</span>
                  <span className="font-black text-mdg-lime">{getSelectedService()?.price.toLocaleString()} RWF</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !selectedService}
              className="w-full py-4 bg-mdg-navy text-white rounded-xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Order...' : 'Confirm & Create Order'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
