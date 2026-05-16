'use client';
import React, { useState } from 'react';
// FIX: Changed from 'next/link' to 'react-router-dom'
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-mdg-background flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-mdg-navy">Create Account</h1>
            <p className="text-mdg-slate mt-2">Join the MDG Laundry community today</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-mdg-navy uppercase ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" required className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm" placeholder="John" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Last Name</label>
                <input type="text" required className="w-full px-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" required className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm" placeholder="name@campus.edu" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="tel" className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm" placeholder="+250 ..." />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-mdg-navy uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" required className="w-full pl-12 pr-4 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue transition-all text-sm" placeholder="Min. 8 characters" />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-mdg-blue focus:ring-mdg-blue" />
              <p className="text-xs text-mdg-slate leading-relaxed">
                {/* FIX: Changed href to to */}
                I agree to the <Link to="/terms" className="text-mdg-blue font-bold">Terms of Service</Link> and <Link to="/privacy" className="text-mdg-blue font-bold">Privacy Policy</Link>.
              </p>
            </div>

            <button className="w-full bg-mdg-navy text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-mdg-blue transition-all shadow-lg">
              Create Account <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-mdg-slate">
              {/* FIX: Changed href to to */}
              Already have an account? <Link to="/auth/login" className="text-mdg-blue font-bold">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}