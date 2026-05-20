import React from 'react';
import { Link } from 'react-router-dom'; // FIXED: Importing from your real project framework
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-mdg-navy pt-20 pb-10 px-6 text-white mt-auto">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-mdg-blue rounded-full" />
            <span className="font-black text-xl tracking-tighter">MDG LAUNDRY</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Building the premier campus ecosystem for shoe and bag restoration. 
            Your gear is our absolute priority.
          </p>
        </div>

        {/* Services Link Column */}
        <div>
          <h4 className="font-bold mb-6 text-mdg-lime uppercase tracking-widest text-xs">Services</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            {/* FIXED: Changed href back to 'to' so react-router-dom processes navigation paths */}
            <li><Link to="/services" className="hover:text-white transition-colors">Shoe Laundry</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Bag Laundry</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Premium Care</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Unyellowing</Link></li>
          </ul>
        </div>

        {/* Company Link Column */}
        <div>
          <h4 className="font-bold mb-6 text-mdg-lime uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white transition-colors">Our Process</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-bold mb-6 text-mdg-lime uppercase tracking-widest text-xs">Location</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-mdg-blue shrink-0" />
              <span>Bumbogo, Gasabo, Kigali</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-mdg-blue shrink-0" />
              <span>+250 795 015 780</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-mdg-blue shrink-0" />
              <span className="truncate">albertmendolza295@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Mendolza De Great (MDG) Laundry. All rights reserved.</p>
      </div>
    </footer>
  );
};