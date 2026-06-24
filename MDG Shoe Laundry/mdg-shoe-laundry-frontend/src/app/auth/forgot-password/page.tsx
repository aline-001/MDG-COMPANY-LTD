'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import api from '../../../lib/api';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // If token is in URL, go to reset step
  useEffect(() => {
    if (resetToken) {
      setStep('reset');
    }
  }, [resetToken]);

  // Step 1: Request password reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message || 'Reset link sent to your email. Check your inbox.');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
        'Failed to send reset link. Please check your email address.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', { 
        token: resetToken,
        newPassword 
      });
      setSuccess(response.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
        'Failed to reset password. Please try again or request a new reset link.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mdg-navy min-h-screen flex items-center justify-center px-6 py-10">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md">
        {/* Header */}
        <Link 
          to="/auth/login"
          className="inline-flex items-center gap-2 text-mdg-blue font-bold text-sm mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mdg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {step === 'email' ? (
              <Mail className="text-mdg-blue" size={32} />
            ) : (
              <Lock className="text-mdg-blue" size={32} />
            )}
          </div>
          <h2 className="text-3xl font-black text-mdg-navy tracking-tighter">RESET PASSWORD</h2>
          <p className="text-mdg-slate text-sm font-bold uppercase tracking-widest mt-2">
            {step === 'email' && 'Enter your email address'}
            {step === 'reset' && 'Create a new password'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <p className="text-green-700 text-sm font-bold">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Step 1: Email */}
        {step === 'email' && !resetToken && (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold"
                placeholder="name@example.com"
                disabled={loading}
              />
              <p className="text-xs text-mdg-slate mt-2">
                Enter the email address associated with your account. We'll send you a password reset link.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mdg-navy text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all shadow-lg shadow-mdg-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Step 2: New Password */}
        {(step === 'reset' || resetToken) && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold"
                placeholder="••••••••"
                minLength={8}
                disabled={loading}
              />
              <p className="text-xs text-mdg-slate mt-2">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mdg-navy text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all shadow-lg shadow-mdg-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-mdg-slate">
            Remember your password? <Link to="/auth/login" className="text-mdg-blue font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
