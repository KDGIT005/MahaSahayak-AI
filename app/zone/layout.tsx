'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Brain, LayoutDashboard, Users, AlertTriangle, LogOut, ChevronRight, MapPin, Home, ArrowLeft, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/zone', label: 'My Zone', icon: LayoutDashboard },
  { href: '/zone/volunteers', label: 'Volunteers', icon: Users },
  { href: '/zone/incidents', label: 'Incidents', icon: AlertTriangle },
];

export default function ZoneLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Zone Manager');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userName');
    if (stored) setUserName(stored);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden w-full" style={{ background: '#FFFBF5' }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-60 flex-shrink-0 flex flex-col h-full transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #0F1E33 0%, #1E3A5F 100%)' }}>
        <div className="px-5 py-5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.2)' }}>
              <Brain size={20} style={{ color: '#F97316' }} />
            </div>
            <div>
              <div className="text-white font-black text-base">MahaSahayak AI</div>
              <div className="text-xs" style={{ color: '#F59E0B' }}>Zone Manager</div>
            </div>
          </div>
          <button 
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: '#F97316' }} />
            <span className="text-xs font-semibold" style={{ color: '#F97316' }}>Ram Ghat (Z02)</span>
          </div>
          <p className="text-white text-xs font-semibold mt-1 truncate">{userName}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link href="/" className="nav-item w-full text-slate-400 hover:text-slate-300 hover:bg-white/5">
            <Home size={18} /><span>Home Page</span>
          </Link>
          <button onClick={() => { localStorage.clear(); router.push('/'); }}
            className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-900/20">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="px-4 md:px-6 py-4 flex items-center justify-between border-b flex-shrink-0"
          style={{ background: 'white', borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2">
            <button 
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} style={{ color: '#1E3A5F' }} />
            </button>
            <button onClick={() => router.back()} className="hidden md:block p-1.5 rounded-lg hover:bg-slate-100 transition-colors mr-1" title="Go Back">
              <ArrowLeft size={16} style={{ color: '#64748B' }} />
            </button>
            <span className="text-sm" style={{ color: '#94A3B8' }}>Zone Manager</span>
            <ChevronRight size={14} style={{ color: '#CBD5E1' }} />
            <span className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>
              {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 min-w-0 w-full">{children}</div>
      </main>
    </div>
  );
}
