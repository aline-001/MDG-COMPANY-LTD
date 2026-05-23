'use client';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, LocateFixed } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    // Wrapper must match the Hero background to kill the top/bottom white gaps
    <div className="bg-mdg-navy min-h-screen font-sans selection:bg-mdg-blue selection:text-white">
      
      {/* SECTION 1: HERO - No top margin, padding-top handles the Navbar space */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Ambient Glow to break the "flat" navy look */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mdg-blue/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl lg:text-[100px] font-black text-white leading-[0.85] tracking-tighter mb-8">
              PREMIUM <br /> 
              <span className="text-mdg-blue italic">RESTORE</span> <br />
              STATION.
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
              Professional shoe and bag restoration. We restore your essentials to factory condition starting from <span className="text-white font-bold">800 RWF</span>.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/dashboard/new-order')}
                className="bg-mdg-blue text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
              >
                Book Pickup
              </button>
            </div>
          </motion.div>

          {/* Fixed Container for Landscape Photo Fitting with Increased Height */}
          <div className="relative group w-full flex items-center justify-center">
            {/* Ambient Glow Background Effect */}
            <div className="absolute inset-0 bg-mdg-blue/20 blur-3xl rounded-full group-hover:bg-mdg-blue/30 transition-all scale-95" />
            
            {/* Expanded Height Image Wrapper */}
            <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-mdg-navy/50">
              <img 
                src="/home_shoes.jpg" 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-all duration-700"
                alt="MDG Craft Restoration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE "PAPER" TRANSITION */}
      {/* We use rounded-t to make the white section look like it's sliding over the navy */}
      <section className="bg-white py-24 px-6 rounded-t-[60px] -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <Feature icon={<Zap size={32} />} title="Express" desc="24-hour turnaround for Bumbogo & Kigali campuses." />
            <Feature icon={<ShieldCheck size={32} />} title="Secure" desc="Every item is digitally tracked and fully insured." />
            <Feature icon={<LocateFixed size={32} />} title="Expert" desc="Material-specific chemicals for Rwandan terrain." />
          </div>
        </div>
      </section>

      {/* SECTION 3: THE CONNECTED FOOTER */}
      {/* No gap between Section 2 and 3 because the footer starts right where the white ends */}
      <footer className="bg-mdg-navy text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Use your previous Footer content here */}
            <div className="col-span-2">
              <h2 className="text-2xl font-black tracking-tighter mb-4">MDG <span className="text-mdg-blue">LAUNDRY.</span></h2>
              <p className="text-gray-500 text-sm max-w-xs uppercase font-bold tracking-widest">Building the premier campus ecosystem.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="flex flex-col">
      <div className="text-mdg-blue mb-6">{icon}</div>
      <h3 className="text-sm font-black text-mdg-navy uppercase tracking-[0.2em] mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}