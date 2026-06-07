'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  Users,
  MapPin,
  AlertTriangle,
  BarChart3,
  Zap,
  Bell,
  LogOut,
  ChevronRight,
  Shield,
  Home,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', labelHindi: 'डैशबोर्ड', icon: LayoutDashboard },
  { href: '/admin/volunteers', label: 'Volunteers', labelHindi: 'स्वयंसेवक', icon: Users },
  { href: '/admin/ai-engine', label: 'AI Assignment', labelHindi: 'AI असाइनमेंट', icon: Brain },
  { href: '/admin/emergency', label: 'Emergency', labelHindi: 'आपातकाल', icon: AlertTriangle, badge: 'LIVE' },
  { href: '/admin/zones', label: 'Zones', labelHindi: 'क्षेत्र', icon: MapPin },
  { href: '/admin/analytics', label: 'Analytics', labelHindi: 'विश्लेषण', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [userName, setUserName] = useState('Admin');
  const [notifications] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userName');
    if (stored) setUserName(stored);
    const storedLang = localStorage.getItem('lang') as 'en' | 'hi' | null;
    if (storedLang) setLang(storedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="flex h-screen overflow-hidden w-full" style={{ background: '#FFFBF5' }}>
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col h-full transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0F1E33 0%, #1E3A5F 100%)',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.2)' }}
            >
              <Brain size={20} style={{ color: '#F97316' }} />
            </div>
            <div>
              <div className="text-white font-black text-base leading-tight">MahaSahayak AI</div>
              <div className="text-xs" style={{ color: '#F59E0B' }}>
                Mahakumbh 2028
              </div>
            </div>
          </div>
          <button 
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-white text-xs font-semibold truncate max-w-[140px]">{userName}</p>
              <div className="flex items-center gap-1">
                <Shield size={10} style={{ color: '#F97316' }} />
                <span className="text-xs" style={{ color: '#F97316' }}>
                  {lang === 'en' ? 'Admin' : 'प्रशासक'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{lang === 'hi' ? item.labelHindi : item.label}</span>
                {item.badge && (
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: '#DC2626', color: 'white', fontSize: '10px' }}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="nav-item w-full"
          >
            <span className="text-base">🌐</span>
            <span className="font-mono text-sm">{lang === 'en' ? 'EN → हि' : 'हि → EN'}</span>
          </button>

          {/* Home Page */}
          <Link href="/" className="nav-item w-full text-slate-400 hover:text-slate-300 hover:bg-white/5">
            <Home size={18} />
            <span>{lang === 'en' ? 'Home Page' : 'होम पेज'}</span>
          </Link>

          {/* Logout */}
          <button onClick={handleLogout} className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-900/20">
            <LogOut size={18} />
            <span>{lang === 'en' ? 'Logout' : 'लॉगआउट'}</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="px-4 md:px-6 py-4 flex items-center justify-between border-b flex-shrink-0"
          style={{ background: 'white', borderColor: '#E2E8F0' }}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} style={{ color: '#1E3A5F' }} />
            </button>
            <button onClick={() => router.back()} className="hidden md:block p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Go Back">
              <ArrowLeft size={16} style={{ color: '#64748B' }} />
            </button>
            {/* Breadcrumb */}
            <span className="text-sm" style={{ color: '#94A3B8' }}>
              {lang === 'en' ? 'Admin' : 'प्रशासक'}
            </span>
            <ChevronRight size={14} style={{ color: '#CBD5E1' }} />
            <span className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>
              {lang === 'en'
                ? navItems.find((n) => n.href === pathname)?.label || 'Dashboard'
                : navItems.find((n) => n.href === pathname)?.labelHindi || 'डैशबोर्ड'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Gemini badge */}
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}
            >
              <Zap size={12} style={{ color: '#F97316' }} />
              <span className="text-xs font-medium" style={{ color: '#F97316' }}>
                Gemini AI Active
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
              >
                <Bell size={18} style={{ color: '#1E3A5F' }} />
              </button>
              {notifications > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold emergency-pulse"
                  style={{ background: '#DC2626' }}
                >
                  {notifications}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 min-w-0 w-full smooth-scroll">
          {children}
        </div>
      </main>
    </div>
  );
}
