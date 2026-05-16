'use client';
import React from 'react';
import { Target, Users, Shield, Leaf } from 'lucide-react';

const values = [
  { title: "Excellence", desc: "We deliver the highest quality service for every pair and bag.", icon: <Target size={24} /> },
  { title: "Integrity", desc: "Honest communication and transparent pricing with no hidden fees.", icon: <Shield size={24} /> },
  { title: "Sustainability", desc: "We use eco-friendly products and promote repair over replacement.", icon: <Leaf size={24} /> },
  { title: "Community", desc: "Serving the campus with respect and building student opportunities.", icon: <Users size={24} /> }
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-24 px-6 bg-mdg-background">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-mdg-navy mb-6">
              Our Story: <br />
              <span className="text-mdg-blue">Built for Purpose</span>
            </h1>
            <p className="text-mdg-slate text-lg leading-relaxed mb-6">
              Founded in Bumbogo, Gasabo, MDG Shoe Laundry began with a simple observation: students have no time, but they value their gear. 
              What started as a campus service has grown into an empire-in-the-making.
            </p>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="italic text-mdg-navy font-medium">
                "I didn't just see dirty shoes. I saw an opportunity to build something great — for students, by someone who walks the same halls."
              </p>
              <p className="mt-4 font-bold text-mdg-blue">— Founder, MDG</p>
            </div>
          </div>
          <div className="aspect-video bg-mdg-navy rounded-[40px] flex items-center justify-center overflow-hidden">
             {/* Placeholder for business location image */}
             <div className="text-white/20 font-black text-4xl">MDG HEADQUARTERS</div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-black text-mdg-navy">Our Core Values</h2>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {values.map((v) => (
            <div key={v.title} className="text-center p-8 rounded-3xl hover:bg-mdg-background transition-colors">
              <div className="w-16 h-16 bg-mdg-blue/10 text-mdg-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                {v.icon}
              </div>
              <h3 className="font-bold text-xl text-mdg-navy mb-3">{v.title}</h3>
              <p className="text-sm text-mdg-slate leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}