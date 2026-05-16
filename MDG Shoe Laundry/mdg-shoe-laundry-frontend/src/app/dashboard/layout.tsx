import { LayoutDashboard, ShoppingCart, History, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'New Order', icon: <ShoppingCart size={20} />, href: '/dashboard/new-order' },
    { name: 'Order History', icon: <History size={20} />, href: '/dashboard/orders' },
    { name: 'Account Settings', icon: <Settings size={20} />, href: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-mdg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-mdg-navy hidden lg:flex flex-col p-6 fixed h-full">
        <div className="mb-10 px-2">
          <span className="text-white font-black text-xl tracking-tighter italic">MDG EMPIRE</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-4 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-bold text-sm">
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <button className="flex items-center gap-4 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all font-bold text-sm mt-auto">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}