import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, LogOut, Settings, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <img src="/MDG%20LOGO.jpg" alt="MDG Logo" className="w-16 h-16 rounded-full object-contain bg-white p-1 shadow-sm" />
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
            <Link to="/gallery" className="hover:text-mdg-blue transition-colors">Gallery</Link>
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
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-mdg-navy font-black p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-24 left-6 right-6 bg-white border border-gray-200 rounded-2xl shadow-xl z-40">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col p-6 space-y-3 border-b border-gray-200">
            <Link 
              to="/" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/gallery" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Process
            </Link>
            <Link 
              to="/track-order" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Track <span className="w-1.5 h-1.5 bg-mdg-lime rounded-full"></span>
            </Link>
            <Link 
              to="/contact" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/help" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            <Link 
              to="/about" 
              className="text-mdg-navy font-bold hover:text-mdg-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>

          {/* Mobile Auth Section */}
          <div className="p-6 space-y-3">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-3 bg-mdg-background rounded-xl mb-3">
                  <p className="text-xs text-mdg-navy/60 font-bold">Logged in as</p>
                  <p className="text-sm font-black text-mdg-navy">{user.email}</p>
                  <p className="text-xs text-mdg-blue font-bold mt-1">{user.role}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 text-mdg-navy hover:bg-mdg-background rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-mdg-navy hover:bg-mdg-background rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings size={16} />
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left font-bold"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth/login" 
                  className="block text-center py-3 text-mdg-navy font-black hover:text-mdg-blue transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/auth/register" 
                  className="block text-center bg-mdg-navy text-white px-6 py-3 rounded-xl font-black hover:bg-mdg-blue transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join MDG
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;