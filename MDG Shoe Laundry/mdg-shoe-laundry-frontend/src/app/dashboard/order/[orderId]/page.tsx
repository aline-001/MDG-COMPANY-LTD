'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Truck, Package } from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import ReviewForm from '../../../../components/ReviewForm';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNotification } from '../../../../contexts/NotificationContext';
import api from '../../../../lib/api';

interface OrderService {
  id: number;
  name: string;
  basePrice: number;
  selectedQuantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  notes: string;
  pickupDate: string;
  pickupLocation: string;
  deliveryLocation?: string;
  deliveryDate?: string;
  createdAt: string;
  services: OrderService[];
}

interface Review {
  id: number;
  rating: number;
  comment: string;
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [order, setOrder] = useState<Order | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, refreshKey]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data.data || res.data);
      
      // Try to fetch existing review
      try {
        const reviewRes = await api.get(`/reviews?orderId=${orderId}`);
        setReview(reviewRes.data.data || null);
      } catch {
        setReview(null);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
      showNotification({
        title: 'Error',
        message: 'Failed to load order details',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="text-yellow-500" size={32} />;
      case 'CONFIRMED':
      case 'IN_PROGRESS':
        return <Clock className="text-blue-500" size={32} />;
      case 'READY_FOR_PICKUP':
        return <Truck className="text-green-500" size={32} />;
      case 'COMPLETED':
        return <CheckCircle className="text-green-600" size={32} />;
      default:
        return <AlertCircle size={32} />;
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdg-navy mx-auto"></div>
          <p className="mt-4 text-mdg-slate">Loading order details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-mdg-slate/40 mb-4" />
          <p className="text-mdg-slate font-bold text-lg">Order not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-mdg-navy" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-mdg-navy">Order Details</h1>
            <p className="text-mdg-slate">{order.orderNumber}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h2 className="text-xl font-black text-mdg-navy mb-6">Order Timeline</h2>
              <div className="space-y-4">
                <TimelineStep
                  title="Order Placed"
                  description="Your order was successfully created"
                  time={new Date(order.createdAt).toLocaleDateString()}
                  isCompleted={true}
                  icon={<Package size={20} />}
                />
                <TimelineStep
                  title="Scheduled Appointment"
                  description={`We will pick up from: ${order.pickupLocation}`}
                  time={new Date(order.pickupDate).toLocaleDateString()}
                  isCompleted={['CONFIRMED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'].includes(order.status)}
                  isActive={order.status === 'CONFIRMED'}
                  icon={<Truck size={20} />}
                />
                <TimelineStep
                  title="Processing"
                  description="Your items are being professionally cleaned"
                  isCompleted={['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'].includes(order.status)}
                  isActive={order.status === 'IN_PROGRESS'}
                  icon={<Clock size={20} />}
                />
                <TimelineStep
                  title="Ready for Delivery"
                  description={`Your shoes are ready and will be delivered to ${order.pickupLocation}`}
                  isCompleted={['READY_FOR_PICKUP', 'COMPLETED'].includes(order.status)}
                  isActive={order.status === 'READY_FOR_PICKUP'}
                  icon={<Truck size={20} />}
                />
                <TimelineStep
                  title="Completed"
                  description="Order delivered to you"
                  time={order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : undefined}
                  isCompleted={order.status === 'COMPLETED'}
                  isActive={false}
                  isLast={true}
                  icon={<CheckCircle size={20} />}
                />
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h2 className="text-xl font-black text-mdg-navy mb-1">Order Status</h2>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-mdg-slate/60 font-bold uppercase mb-1">Order Date</p>
                  <p className="font-semibold text-mdg-navy">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-mdg-slate/60 font-bold uppercase mb-1">Scheduled Appointment</p>
                  <p className="font-semibold text-mdg-navy">{new Date(order.pickupDate).toLocaleDateString()}</p>
                </div>
                {order.deliveryDate && (
                  <div>
                    <p className="text-mdg-slate/60 font-bold uppercase mb-1">Delivery Date</p>
                    <p className="font-semibold text-mdg-navy">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Delivery Location Card */}
              <div className="bg-gradient-to-r from-mdg-blue/10 to-mdg-blue/5 border border-mdg-blue/20 rounded-xl p-4">
                <p className="text-mdg-slate/60 font-bold uppercase text-xs mb-2">📍 Delivery Location</p>
                <p className="font-bold text-mdg-navy text-lg">{order.pickupLocation || 'Not specified'}</p>
              </div>
            </div>

            {/* Services Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h2 className="text-xl font-black text-mdg-navy mb-6">Services</h2>
              <div className="space-y-4">
                {order.services && order.services.length > 0 ? (
                  order.services.map((service) => (
                    <div key={service.id} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-bold text-mdg-navy">{service.name}</p>
                        <p className="text-sm text-mdg-slate">Qty: {service.selectedQuantity}</p>
                      </div>
                      <p className="font-bold text-mdg-navy">
                        {(service.basePrice * service.selectedQuantity).toLocaleString()} RWF
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-mdg-slate">No services in this order</p>
                )}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h2 className="text-xl font-black text-mdg-navy mb-3">Special Instructions</h2>
                <p className="text-mdg-slate">{order.notes}</p>
              </div>
            )}

            {/* Review Form - Only show if order is completed and no review exists */}
            {order.status === 'COMPLETED' && !review && (
              <ReviewForm 
                orderId={order.id} 
                onSubmitSuccess={() => setRefreshKey(prev => prev + 1)}
              />
            )}

            {/* Existing Review */}
            {review && (
              <div className="bg-mdg-lime/20 rounded-2xl p-8 border-2 border-mdg-lime">
                <h2 className="text-xl font-black text-mdg-navy mb-4">Your Review</h2>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= review.rating ? 'text-mdg-lime text-2xl' : 'text-gray-300 text-2xl'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-mdg-navy">{review.comment}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Summary */}
          <div>
            <div className="bg-mdg-navy text-white rounded-2xl p-8 sticky top-24 space-y-6">
              <div>
                <h3 className="text-lg font-black mb-6">Order Summary</h3>
                <div className="space-y-4 border-t border-white/20 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-bold">{order.totalAmount.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-4">
                    <span className="font-black">Total</span>
                    <span className="font-black text-mdg-lime">{order.totalAmount.toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>

              {/* Pickup Information */}
              <div className="border-t border-white/20 pt-6">
                <h4 className="font-black text-sm mb-4 uppercase tracking-wider">📍 Pickup Info</h4>
                <div className="bg-white/10 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase mb-1">Location</p>
                    <p className="text-white font-semibold">{order.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase mb-1">Date</p>
                    <p className="text-white font-semibold">{new Date(order.pickupDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function TimelineStep({
  title,
  description,
  time,
  isCompleted,
  isActive,
  isLast,
  icon,
}: {
  title: string;
  description: string;
  time?: string;
  isCompleted: boolean;
  isActive?: boolean;
  isLast?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      {/* Timeline Dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-mdg-lime text-white' : isActive ? 'bg-mdg-blue text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {icon}
        </div>
        {!isLast && (
          <div
            className={`w-1 h-12 ${isCompleted ? 'bg-mdg-lime' : isActive ? 'bg-mdg-blue' : 'bg-gray-200'}`}
          />
        )}
      </div>

      {/* Timeline Content */}
      <div className="pb-4">
        <h4 className={`font-bold ${isCompleted ? 'text-mdg-navy' : isActive ? 'text-mdg-blue' : 'text-mdg-slate'}`}>
          {title}
        </h4>
        <p className="text-sm text-mdg-slate mt-1">{description}</p>
        {time && <p className="text-xs text-mdg-slate/60 mt-2">{time}</p>}
      </div>
    </div>
  );
}
