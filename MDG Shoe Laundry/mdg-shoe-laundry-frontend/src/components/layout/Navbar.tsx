import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/auth/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-5">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl px-8 py-4 flex justify-between items-center shadow-lg shadow-black/5">
        
        {/* Brand/Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-mdg-navy rounded-xl flex items-center justify-center font-black text-white text-xl group-hover:bg-mdg-blue transition-colors">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-black text-mdg-navy text-lg leading-none tracking-tighter">MDG LAUNDRY</span>
            <span className="text-[10px] font-bold text-mdg-blue tracking-[0.2em] uppercase">Restoration Station</span>
          </div>
        </Link>
        
        {/* Full Navigation Links */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8 text-[13px] font-black uppercase tracking-widest text-mdg-navy/60">
            <Link to="/" className="hover:text-mdg-blue transition-colors">Home</Link>
            <Link to="/services" className="hover:text-mdg-blue transition-colors">Services</Link>
            <Link to="/how-it-works" className="hover:text-mdg-blue transition-colors">Process</Link>
            <Link to="/track-order" className="hover:text-mdg-blue transition-colors flex items-center gap-2">
              Track <span className="w-1.5 h-1.5 bg-mdg-lime rounded-full"></span>
            </Link>
            <Link to="/contact" className="hover:text-mdg-blue transition-colors">Contact</Link>
            <Link to="/help" className="hover:text-mdg-blue transition-colors">Help</Link>
            <Link to="/about" className="hover:text-mdg-blue transition-colors">About</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-mdg-navy hover:text-mdg-blue transition-colors"
                >
                  {user.firstName}
                  <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-mdg-background border-b border-gray-200">
                      <p className="text-xs text-mdg-navy/60 font-bold">Logged in as</p>
                      <p className="text-sm font-black text-mdg-navy">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-mdg-navy hover:bg-mdg-background transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-3 text-mdg-navy hover:bg-mdg-background transition-colors border-t border-gray-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-200 text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth/login" className="text-[13px] font-black uppercase tracking-widest text-mdg-navy hover:text-mdg-blue transition-colors">
                  Login
                </Link>
                <Link to="/auth/register" className="bg-mdg-navy text-white px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-[0.1em] hover:bg-mdg-blue hover:shadow-xl hover:shadow-mdg-blue/20 transition-all">
                  Join MDG
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle (Simplified for now) */}
        <button className="lg:hidden text-mdg-navy font-black">MENU</button>
      </div>
    </nav>
  );
};

export default Navbar;