'use client';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the terms of service');
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone,
      );
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mdg-background flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-mdg-navy">Create Account</h1>
            <p className="text-mdg-slate mt-2">Join the MDG Laundry community today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-700 text-sm font-bold">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-mdg-navy uppercase ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required 
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm disabled:opacity-50" 
                    placeholder="John" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                  disabled={loading}
                  className="w-full px-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm disabled:opacity-50" 
                  placeholder="Doe" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm disabled:opacity-50" 
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm disabled:opacity-50" 
                  placeholder="+250 ..." 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm disabled:opacity-50" 
                  placeholder="Min. 8 characters" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm disabled:opacity-50" 
                  placeholder="Confirm password" 
                />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={loading}
                className="mt-1 rounded border-gray-300 text-mdg-blue focus:ring-mdg-blue disabled:opacity-50" 
              />
              <p className="text-xs text-mdg-slate leading-relaxed">
                I agree to the <Link to="/terms" className="text-mdg-blue font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-mdg-blue font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-mdg-navy text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-mdg-blue transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-mdg-slate">
              Already have an account? <Link to="/auth/login" className="text-mdg-blue font-bold hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}