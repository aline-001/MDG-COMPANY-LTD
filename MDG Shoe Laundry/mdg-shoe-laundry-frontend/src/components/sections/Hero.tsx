import React from 'react';
// FIX: Changed from 'next/link' to 'react-router-dom'
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative bg-mdg-navy py-20 px-6 overflow-hidden">
      {/* Visual background pop */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mdg-blue/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-mdg-lime text-mdg-navy px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
            New Service: Bag Laundry 
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mt-6 mb-4">
            Your Shoes and Bags, <span className="text-mdg-blue">Our Priority.</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            The ultimate campus fresh-up. Professional cleaning starting from only <span className="text-mdg-lime font-bold">800 RWF</span>. 
            Get 25% cash back on your first bag wash!
          </p>
          <div className="flex flex-wrap gap-4">
            {/* FIX: Changed href to to */}
            <Link to="/auth/register" className="bg-mdg-blue text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
              Book a Pickup
            </Link>
            <Link to="/services" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-mdg-navy transition-all">
              View Prices
            </Link>
          </div>
        </div>
        
        <div className="relative rounded-3xl border-4 border-white/10 overflow-hidden shadow-2xl">
          <img src="/api/placeholder/600/400" alt="MDG Excellence" className="w-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-mdg-navy/80 backdrop-blur-md p-4 rounded-lg">
            <p className="text-mdg-lime font-bold">2 Pairs = 1500 RWF Only!</p>
          </div>
        </div>
      </div>
    </section>
  );
};