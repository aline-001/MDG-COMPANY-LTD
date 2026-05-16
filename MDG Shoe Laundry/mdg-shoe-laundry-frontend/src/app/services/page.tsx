'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Wind, 
  Droplets, 
  ShieldCheck, 
  Briefcase, 
  Zap,
  RotateCcw
} from 'lucide-react';
// FIX: Changed from 'next/link' to 'react-router-dom'
import { Link } from 'react-router-dom';

const shoeServices = [
  {
    name: "Regular Cleaning",
    price: "800 RWF",
    time: "2-3 Days",
    desc: "Perfect for everyday campus wear.",
    features: ["Surface wash", "Odor removal", "Lace cleaning"]
  },
  {
    name: "Medium Cleaning",
    price: "1000 RWF",
    time: "2-3 Days",
    desc: "Tackle tougher stains and deep dirt.",
    features: ["Deep material scrub", "Stain pre-treatment", "Standard drying", "Midsole whitening"]
  },
  {
    name: "Extreme Cleaning",
    price: "1500 RWF",
    time: "3-4 Days",
    featured: true,
    desc: "Complete restoration for heavily soiled pairs.",
    features: ["Internal sanitation", "Advanced stain removal", "Premium finish", "Protective spray"]
  }
];

const bagServices = [
  { name: "Leather Bags", icon: <Briefcase size={20} />, desc: "Gentle cleaning & conditioning." },
  { name: "Canvas Bags", icon: <Wind size={20} />, desc: "Deep fiber cleaning for backpacks." },
  { name: "Lace & Delicate", icon: <Droplets size={20} />, desc: "Careful hand-wash for special materials." }
];

export default function ServicesPage() {
  return (
    <div className="bg-mdg-background min-h-screen">
      {/* Header Section */}
      <section className="bg-mdg-navy py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('/grid.svg')] opacity-10" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-white mb-4"
        >
          Professional <span className="text-mdg-blue">Care Menu</span>
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Expert cleaning for your most valued campus essentials. 
          Quality guaranteed or we re-clean for free.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* SHOE LAUNDRY SECTION */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gray-200" />
            <h2 className="text-2xl font-black text-mdg-navy uppercase tracking-widest">Shoe Laundry</h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {shoeServices.map((service) => (
              <div 
                key={service.name}
                className={`p-8 rounded-[32px] border transition-all ${
                  service.featured 
                  ? 'bg-white border-mdg-blue shadow-xl scale-105 z-10' 
                  : 'bg-white border-gray-100 hover:border-mdg-blue'
                }`}
              >
                {service.featured && (
                  <span className="bg-mdg-blue text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-mdg-navy mb-2">{service.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-mdg-navy">{service.price}</span>
                  <span className="text-mdg-slate text-sm">/ pair</span>
                </div>
                <p className="text-mdg-slate text-sm mb-6">{service.desc}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-mdg-navy font-medium">
                      <CheckCircle2 size={18} className="text-mdg-blue" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-xs font-bold text-mdg-slate mb-6">
                  <RotateCcw size={14} /> Turnaround: {service.time}
                </div>

                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  service.featured ? 'bg-mdg-blue text-white shadow-lg' : 'bg-mdg-navy text-white'
                }`}>
                  Select Service
                </button>
              </div>
            ))}
          </div>
          
          {/* Bundle Offer Banner */}
          <div className="mt-12 bg-mdg-lime/20 border-2 border-dashed border-mdg-lime p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-mdg-navy font-black text-xl">The Campus Bundle</h4>
              <p className="text-mdg-navy/70">Bring 2 pairs and pay only <span className="font-bold">1500 RWF</span> total.</p>
            </div>
            {/* FIX: Changed href to to */}
            <Link to="/auth/register" className="bg-mdg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-mdg-blue transition-colors">
              Claim Discount
            </Link>
          </div>
        </div>

        {/* BAG LAUNDRY SECTION */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gray-200" />
            <h2 className="text-2xl font-black text-mdg-navy uppercase tracking-widest">Bag Laundry</h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bagServices.map((bag) => (
              <div key={bag.name} className="bg-white p-8 rounded-[32px] border border-gray-100 flex items-start gap-5 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-mdg-background rounded-2xl flex items-center justify-center group-hover:bg-mdg-blue group-hover:text-white transition-colors text-mdg-blue">
                  {bag.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-mdg-navy mb-1">{bag.name}</h3>
                  <p className="text-mdg-slate text-sm mb-4">{bag.desc}</p>
                  <span className="text-mdg-blue font-bold text-sm uppercase tracking-tighter">25% Cash Back Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <section className="bg-mdg-navy py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-50">
           <div className="flex items-center gap-2 text-white font-bold"><ShieldCheck /> Insured Service</div>
           <div className="flex items-center gap-2 text-white font-bold"><Droplets /> Eco-Friendly</div>
           <div className="flex items-center gap-2 text-white font-bold"><Zap /> Express Option</div>
        </div>
      </section>
    </div>
  );
}