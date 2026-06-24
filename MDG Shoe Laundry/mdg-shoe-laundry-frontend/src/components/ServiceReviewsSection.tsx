'use client';
import { useState, useEffect } from 'react';
import { Star, MessageCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ReviewForm from './ReviewForm';

interface CompletedOrder {
  id: number;
  status: string;
}

export default function ServiceReviewsSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        fetchCompletedOrders();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedOrders = async () => {
    try {
      const res = await api.get('/orders');
      const payload = res.data?.orders ?? res.data?.data ?? res.data;
      const orders = Array.isArray(payload) ? payload : [];
      const completed = orders.filter((order: any) => order.status === 'COMPLETED');
      setCompletedOrders(completed);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setCompletedOrders([]);
    }
  };

  const handleReviewSuccess = () => {
    // Reset form and refresh
    setSelectedOrderId(null);
    fetchCompletedOrders();
  };

  if (loading) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-mdg-blue/5 to-mdg-lime/5 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="text-mdg-blue" size={32} />
            <h2 className="text-4xl font-black text-mdg-navy">Share Your Review</h2>
          </div>
          <p className="text-mdg-slate max-w-2xl mx-auto text-lg">
            Help us improve by sharing your experience with our laundry services. Your feedback matters!
          </p>
        </div>

        {!isAuthenticated ? (
          // Not authenticated - Show login/register CTA
          <div className="bg-white rounded-2xl p-12 border-2 border-mdg-blue/20 text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-mdg-blue/10 p-4 rounded-full">
                <Lock size={40} className="text-mdg-blue" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-mdg-navy mb-3">Sign in to Leave a Review</h3>
            <p className="text-mdg-slate mb-8">
              Complete an order first, then share your experience and help other customers!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/auth/login"
                className="px-8 py-3 bg-mdg-navy text-white rounded-xl font-bold hover:bg-mdg-blue transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-8 py-3 bg-mdg-lime text-mdg-navy rounded-xl font-bold hover:bg-mdg-lime/90 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : completedOrders.length === 0 ? (
          // Authenticated but no completed orders
          <div className="bg-white rounded-2xl p-12 border-2 border-mdg-lime/20 text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-mdg-lime/10 p-4 rounded-full">
                <Star size={40} className="text-mdg-lime" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-mdg-navy mb-3">No Completed Orders Yet</h3>
            <p className="text-mdg-slate mb-8">
              Place an order first to share your experience with our services. We can't wait to hear what you think!
            </p>
            <Link
              to="/order"
              className="inline-block px-8 py-3 bg-mdg-blue text-white rounded-xl font-bold hover:bg-mdg-navy transition-all"
            >
              Place Your First Order
            </Link>
          </div>
        ) : (
          // Show review form with order selection
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border-2 border-mdg-blue/20">
            {completedOrders.length > 1 && !selectedOrderId ? (
              // Order selection
              <div>
                <h3 className="text-xl font-bold text-mdg-navy mb-6">Select an Order to Review</h3>
                <div className="space-y-3">
                  {completedOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-mdg-blue hover:bg-mdg-blue/5 transition-all text-left font-semibold text-mdg-navy"
                    >
                      Order #{order.id}
                    </button>
                  ))}
                </div>
              </div>
            ) : selectedOrderId ? (
              <div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="text-mdg-blue font-semibold mb-4 hover:underline"
                >
                  ← Back to Orders
                </button>
                <ReviewForm
                  orderId={selectedOrderId}
                  onSubmitSuccess={handleReviewSuccess}
                />
              </div>
            ) : completedOrders.length === 1 ? (
              <ReviewForm
                orderId={completedOrders[0].id}
                onSubmitSuccess={handleReviewSuccess}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
