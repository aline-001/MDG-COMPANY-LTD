'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shoeType: 'Sneakers',
    serviceType: 'Shoe Laundry'
  });

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This maps directly to your Prisma Order and Shoe models
      const response = await api.post('/orders', {
        pickupLocation: "Bumbogo Facility, Gasabo", // Your verified location
        pickupDate: new Date().toISOString(), // TODO: Add date picker to form
        notes: `${formData.shoeType} - ${formData.serviceType}`,
        shoes: [{
          brand: formData.shoeType,
          model: formData.serviceType,
        }],
      });

      console.log("Order Stored:", response.data);
      // Redirect to tracking page with the new Order ID
      navigate(`/track-order?id=${response.data.id}`);
    } catch (error) {
      console.error("Error creating order", error);
      alert("Failed to create order. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mdg-navy min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-mdg-blue rounded-2xl flex items-center justify-center text-white">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-3xl font-black text-mdg-navy tracking-tighter uppercase">New Restoration</h1>
        </div>

        <form onSubmit={submitOrder} className="space-y-8">
          {/* Customer Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="Aline Asimwe"
              className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shoe Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">Item Type</label>
              <select 
                className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold appearance-none"
                onChange={(e) => setFormData({...formData, shoeType: e.target.value})}
              >
                <option>Sneakers</option>
                <option>Formal Shoes</option>
                <option>Leather Bag</option>
                <option>Backpack</option>
              </select>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-mdg-navy uppercase tracking-widest ml-2">Service</label>
              <select 
                className="w-full bg-mdg-background border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-mdg-blue transition-all font-bold appearance-none"
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
              >
                <option>Shoe Laundry</option>
                <option>Bag Laundry</option>
                <option>Premium Care</option>
                <option>Unyellowing</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-mdg-navy text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Confirm Booking <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}