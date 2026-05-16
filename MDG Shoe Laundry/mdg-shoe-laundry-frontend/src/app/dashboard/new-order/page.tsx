'use client';
import React, { useState, useRef } from 'react';
import { ShoppingBag, ChevronRight, Upload, Info, Briefcase } from 'lucide-react';

export default function NewOrderPage() {
  const [serviceType, setServiceType] = useState('shoe');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-mdg-navy mb-8">Place New Order</h1>
      
      <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm">
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          
          {/* 1. Service Selection */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-mdg-navy uppercase tracking-widest flex items-center gap-2">
              1. Select Service Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shoe Laundry Option */}
              <label 
                className={`relative flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  serviceType === 'shoe' ? 'border-mdg-blue bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'
                }`}
                onClick={() => setServiceType('shoe')}
              >
                <input type="radio" name="service" className="hidden" defaultChecked />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  serviceType === 'shoe' ? 'bg-mdg-blue text-white' : 'bg-mdg-background text-mdg-blue'
                }`}>
                   <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="font-bold text-mdg-navy">Shoe Laundry</p>
                  <p className="text-xs text-mdg-slate font-medium">From 800 RWF per pair</p>
                </div>
              </label>

              {/* Bag Laundry Option */}
              <label 
                className={`relative flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  serviceType === 'bag' ? 'border-mdg-blue bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'
                }`}
                onClick={() => setServiceType('bag')}
              >
                <input type="radio" name="service" className="hidden" />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  serviceType === 'bag' ? 'bg-mdg-blue text-white' : 'bg-mdg-background text-mdg-blue'
                }`}>
                   <Briefcase size={24} />
                </div>
                <div>
                  <p className="font-bold text-mdg-navy">Bag Laundry</p>
                  <p className="text-xs text-mdg-slate font-medium">From 1000 RWF per item</p>
                </div>
              </label>
            </div>
          </section>

          {/* 2. Item Details */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-mdg-navy uppercase tracking-widest">2. Item Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-mdg-slate uppercase ml-1">Brand / Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nike Air Force 1" 
                  className="w-full px-6 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue font-medium text-sm" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-mdg-slate uppercase ml-1">Condition</label>
                <div className="relative">
                  <select className="w-full px-6 py-4 bg-mdg-background rounded-2xl border-none focus:ring-2 focus:ring-mdg-blue appearance-none font-medium text-sm text-mdg-navy">
                    <option>Lightly Soiled</option>
                    <option>Medium Dirt</option>
                    <option>Extremely Dirty</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Image Upload Area */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-mdg-navy uppercase tracking-widest">3. Photos (Required)</h2>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
            />
            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-mdg-blue hover:bg-gray-50 transition-all group cursor-pointer"
            >
              <div className="inline-flex p-4 rounded-full bg-mdg-background text-mdg-blue mb-4 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <p className="text-sm font-bold text-mdg-navy">Click to upload or drag and drop</p>
              <p className="text-xs text-mdg-slate mt-1 font-medium">Clear photos help us assess the material (Max 5MB)</p>
            </div>
          </section>

          {/* Information Alert */}
          <div className="bg-blue-50 p-6 rounded-3xl flex gap-4 border border-blue-100">
            <Info className="text-mdg-blue shrink-0" size={20} />
            <p className="text-xs text-blue-800 leading-relaxed font-semibold">
              By placing this order, you agree to our professional service protocol. 
              An MDG representative will contact you at your campus location in Bumbogo to confirm collection and pricing.
            </p>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-mdg-navy text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-mdg-blue hover:shadow-xl hover:shadow-mdg-blue/20 transition-all">
            Review and Confirm <ChevronRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}