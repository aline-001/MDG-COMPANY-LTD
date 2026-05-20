'use client';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, History, Settings, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'New Order', icon: <ShoppingCart size={20} />, href: '/dashboard/new-order' },
    { name: 'Order History', icon: <History size={20} />, href: '/dashboard/orders' },
    { name: 'Account Settings', icon: <Settings size={20} />, href: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-mdg-background flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-40 p-2 bg-mdg-navy text-white rounded-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 w-64 bg-mdg-navy fixed lg:relative h-screen flex flex-col p-6 z-30`}>
        <div className="mb-10 px-2">
          <span className="text-white font-black text-xl tracking-tighter italic">MDG EMPIRE</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive(item.href)
                  ? 'bg-mdg-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-700 pt-4 space-y-4">
          {user && (
            <div className="px-4 py-3 bg-white/5 rounded-xl">
              <p className="text-xs text-gray-400 uppercase font-bold">Logged in as</p>
              <p className="text-white font-bold">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-mdg-lime font-bold uppercase mt-1">{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 pt-24 lg:pt-8">
        {children}
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
