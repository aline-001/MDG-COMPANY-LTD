'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Truck, 
  Sparkles, 
  PackageCheck, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
// FIX: Changed from 'next/link' to 'react-router-dom'
import { Link } from 'react-router-dom';

const steps = [
  {
    id: "01",
    title: "Create Your Order",
    icon: <ClipboardList className="text-mdg-blue" size={32} />,
    details: [
      "Sign up and create your secure account",
      "Choose your specific shoe or bag service",
      "Upload photos for initial assessment",
      "Select your preferred pickup date"
    ]
  },
  {
    id: "02",
    title: "Schedule Pickup",
    icon: <Truck className="text-mdg-blue" size={32} />,
    details: [
      "Free pickup available across campus",
      "Secure handling from the moment of collection",
      "Digital receipt issued immediately",
      "Insurance included for all items"
    ]
  },
  {
    id: "03",
    title: "Expert Cleaning",
    icon: <Sparkles className="text-mdg-blue" size={32} />,
    details: [
      "Professional inspection by head technicians",
      "Material-specific cleaning techniques",
      "Premium, eco-friendly products only",
      "Real-time status updates via your dashboard"
    ]
  },
  {
    id: "04",
    title: "Delivery & Review",
    icon: <PackageCheck className="text-mdg-blue" size={32} />,
    details: [
      "Final quality control inspection",
      "Items returned in premium packaging",
      "Free return delivery to your location",
      "100% satisfaction guarantee"
    ]
  }
];

export default function HowItWorks() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-mdg-navy py-24 px-6 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            A Simple, <span className="text-mdg-blue">Professional Process</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            From the moment you book until your gear is back in your hands, 
            every step is handled with expert precision and care at our Bumbogo facility.
          </p>
        </div>
      </section>

      {/* Detailed Steps Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-start gap-12 p-8 rounded-[40px] border border-gray-100 ${
                  index % 2 === 0 ? 'bg-mdg-background' : 'bg-white shadow-sm'
                }`}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center">
                  {step.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-mdg-blue font-black text-xl tracking-tighter">STEP {step.id}</span>
                    <h2 className="text-3xl font-bold text-mdg-navy">{step.title}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {step.details.map((detail, dIndex) => (
                      <div key={dIndex} className="flex items-start gap-3 text-mdg-slate">
                        <CheckCircle size={18} className="text-mdg-blue mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-mdg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Estimated Timeline</h2>
            <p className="text-gray-400">Total turnaround time: 2-9 business days depending on service tier.</p>
          </div>
          
          <div className="relative border-l border-white/10 ml-4 md:ml-0 md:border-l-0 md:flex md:justify-between">
            {[
              { day: "Day 1", event: "Order & Pickup" },
              { day: "Day 2-3", event: "Facility Arrival" },
              { day: "Day 4-7", event: "Expert Cleaning" },
              { day: "Day 8", event: "Quality Check" },
              { day: "Day 9", event: "Final Delivery" }
            ].map((item, index) => (
              <div key={index} className="mb-10 md:mb-0 relative md:text-center px-8">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-mdg-blue md:static md:mx-auto md:mb-4 shadow-[0_0_15px_rgba(0,174,239,0.5)]" />
                <h3 className="font-bold text-mdg-lime">{item.day}</h3>
                <p className="text-sm text-gray-300">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-black text-mdg-navy mb-8">Ready to experience excellence?</h2>
        {/* FIX: Changed href to to */}
        <Link 
          to="/auth/register" 
          className="inline-flex items-center gap-3 bg-mdg-blue text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-mdg-navy transition-all shadow-xl shadow-mdg-blue/20"
        >
          Start Your Order <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}