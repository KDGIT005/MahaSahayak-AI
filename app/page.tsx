'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Shield,
  Activity,
  AlertTriangle,
  BarChart3,
  Globe,
  Zap,
  Users,
  MapPin,
  ChevronRight,
  Star,
  ArrowRight,
} from 'lucide-react';

// Animated Counter
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Pre-seeded particle data — deterministic, never calls Math.random() at render time
const PARTICLE_DATA = [
  { left: 12, w: 5.2, h: 4.8, dur: 14.3, delay: 2.1, c: 0 },
  { left: 28, w: 3.8, h: 6.1, dur: 11.7, delay: 5.4, c: 1 },
  { left: 45, w: 7.1, h: 3.9, dur: 16.2, delay: 0.8, c: 2 },
  { left: 61, w: 4.5, h: 7.3, dur: 9.8,  delay: 7.2, c: 0 },
  { left: 77, w: 6.3, h: 5.0, dur: 13.1, delay: 3.6, c: 1 },
  { left: 90, w: 3.4, h: 4.2, dur: 15.5, delay: 1.9, c: 2 },
  { left: 5,  w: 8.0, h: 6.8, dur: 10.4, delay: 6.3, c: 0 },
  { left: 35, w: 4.9, h: 3.5, dur: 17.8, delay: 4.1, c: 1 },
  { left: 52, w: 6.7, h: 8.0, dur: 8.9,  delay: 0.5, c: 2 },
  { left: 68, w: 3.2, h: 5.6, dur: 12.6, delay: 7.8, c: 0 },
  { left: 83, w: 7.5, h: 4.1, dur: 14.9, delay: 2.7, c: 1 },
  { left: 19, w: 5.8, h: 7.4, dur: 9.3,  delay: 5.9, c: 2 },
  { left: 41, w: 4.3, h: 3.8, dur: 16.7, delay: 1.3, c: 0 },
  { left: 57, w: 6.1, h: 6.2, dur: 11.2, delay: 4.8, c: 1 },
  { left: 73, w: 3.7, h: 5.3, dur: 13.8, delay: 6.7, c: 2 },
  { left: 88, w: 8.4, h: 4.7, dur: 8.4,  delay: 3.2, c: 0 },
  { left: 24, w: 5.5, h: 6.9, dur: 15.1, delay: 0.3, c: 1 },
  { left: 48, w: 4.0, h: 3.4, dur: 10.9, delay: 7.5, c: 2 },
  { left: 65, w: 7.8, h: 7.1, dur: 12.3, delay: 2.4, c: 0 },
  { left: 95, w: 3.5, h: 5.8, dur: 17.2, delay: 5.1, c: 1 },
];

const PARTICLE_COLORS = [
  'rgba(249,115,22,0.5)',
  'rgba(245,158,11,0.4)',
  'rgba(255,255,255,0.2)',
];

// Floating Particle — client-only to avoid hydration mismatch
function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_DATA.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.w}px`,
            height: `${p.h}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            background: PARTICLE_COLORS[p.c],
          }}
        />
      ))}
    </div>
  );
}


const features = [
  {
    icon: Brain,
    title: 'AI Assignment Engine',
    description:
      'Gemini AI matches volunteers to zones by skill, language, workload, and proximity in seconds.',
    color: '#F97316',
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description:
      'Live dashboard with instant updates on volunteer status, zone coverage, and incidents.',
    color: '#1E3A5F',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Response',
    description:
      'AI identifies nearest qualified responders in under 3 seconds during any crisis.',
    color: '#DC2626',
  },
  {
    icon: BarChart3,
    title: 'Workload Balancing',
    description:
      'Burnout prevention through continuous AI monitoring and smart rotation suggestions.',
    color: '#D97706',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description:
      'Language-aware volunteer matching for Hindi, English, Bhojpuri, Bengali, and more.',
    color: '#16A34A',
  },
  {
    icon: Shield,
    title: 'Bharat Ready Score™',
    description:
      'AI-calculated composite readiness metric combining skills, experience, and availability.',
    color: '#7C3AED',
  },
];

const roles = [
  {
    role: 'admin' as const,
    title: 'Admin',
    titleHindi: 'प्रशासक',
    description: 'Central command — full access to all zones, AI insights, and emergency response',
    icon: Shield,
    color: '#1E3A5F',
    bg: 'rgba(30,58,95,0.06)',
    border: 'rgba(30,58,95,0.15)',
    features: ['Zone heatmap', 'AI optimization', 'Emergency center', 'Analytics'],
  },
  {
    role: 'zone_manager' as const,
    title: 'Zone Manager',
    titleHindi: 'क्षेत्र प्रबंधक',
    description: 'Manage your assigned zone — volunteers, incidents, and local deployments',
    icon: MapPin,
    color: '#F97316',
    bg: 'rgba(249,115,22,0.06)',
    border: 'rgba(249,115,22,0.2)',
    features: ['Zone volunteers', 'Incident reporting', 'AI requests', 'Local alerts'],
  },
  {
    role: 'volunteer' as const,
    title: 'Volunteer',
    titleHindi: 'स्वयंसेवक',
    description: 'View your assignments, Bharat Ready Score, and availability status',
    icon: Users,
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.06)',
    border: 'rgba(22,163,74,0.2)',
    features: ['My assignments', 'Bharat Score', 'Availability toggle', 'Notifications'],
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFFBF5' }}>

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden w-full max-w-full"
        style={{
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 30%, #1E3A5F 70%, #0F1E33 100%)',
        }}
      >
        <Particles />

        {/* Lotus pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 80%, rgba(245,158,11,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          }}
        />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 px-4 md:px-8 py-5 flex flex-wrap items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              <Brain size={22} color="white" />
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tight">MahaSahayak AI</span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.3)', color: '#FCD34D' }}>
                Mahakumbh 2028
              </span>
            </div>
          </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  try {
                    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (select) {
                      select.value = select.value === 'hi' ? 'en' : 'hi';
                      select.dispatchEvent(new Event('change'));
                    } else {
                      const isHi = document.cookie.includes('googtrans=/en/hi');
                      document.cookie = `googtrans=/en/${isHi ? 'en' : 'hi'}; path=/`;
                      window.location.reload();
                    }
                  } catch(e) {}
                }}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 transition-all hover:bg-white hover:bg-opacity-10"
                style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                title="Translate to Hindi / English"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">A/अ</span>
              </button>
              <button
                onClick={() => router.push('/login')}
                className="btn-primary"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#EA580C' }}
              >
                Sign In →
              </button>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-28 pb-12 relative z-10 w-full max-w-7xl">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(245,158,11,0.2)',
                border: '1px solid rgba(245,158,11,0.4)',
              }}>
              <Star size={14} style={{ color: '#FCD34D' }} fill="#FCD34D" />
              <span className="text-sm font-semibold" style={{ color: '#FCD34D' }}>
                Mahakumbh Innovation Hackathon 2028 · VIT Bhopal
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-2">
              MahaSahayak AI
            </h1>
            <p className="text-2xl font-medium mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              स्वयंसेवक प्रबंधन प्रणाली
            </p>
            <p className="text-xl text-white font-semibold mb-3">
              AI-Powered Volunteer Deployment for Mahakumbh 2028
            </p>
            <p className="text-base mb-10 max-w-2xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Managing 50,000+ volunteers across 10 critical zones with Google Gemini AI.
              Real-time deployment, emergency response, and burnout prevention — all in one platform.
            </p>

            {/* Live counters */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { label: 'Volunteers', value: 1247, suffix: '+', icon: Users },
                { label: 'Zones', value: 10, suffix: '', icon: MapPin },
                { label: 'Coverage', value: 98, suffix: '%', icon: Activity },
                { label: 'AI Responses', value: 342, suffix: '+', icon: Brain },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <stat.icon size={18} style={{ color: '#FCD34D' }} />
                  <div>
                    <div className="text-xl font-black text-white">
                      <Counter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/login?role=admin')}
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-base transition-all hover:scale-105"
                style={{
                  background: 'white',
                  color: '#EA580C',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                <Zap size={18} />
                Open Command Centre
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => router.push('/login?role=volunteer')}
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-base transition-all"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <Users size={18} />
                Volunteer Portal
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Scroll to explore
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ROLE SELECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-lotus relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <Brain size={14} style={{ color: '#F97316' }} />
              <span className="text-sm font-semibold" style={{ color: '#F97316' }}>
                Role-Based Access
              </span>
            </div>
            <h2 className="text-4xl font-black mb-4" style={{ color: '#1E3A5F' }}>
              Choose Your Portal
            </h2>
            <p className="text-lg" style={{ color: '#64748B' }}>
              Three role-specific dashboards designed for real Mahakumbh operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div
                key={r.role}
                className="card p-6 md:p-8 cursor-pointer group relative overflow-hidden h-full flex flex-col"
                style={{
                  borderColor: hoveredRole === r.role ? r.border : undefined,
                  boxShadow: hoveredRole === r.role
                    ? `0 16px 48px ${r.color}25`
                    : undefined,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onMouseEnter={() => setHoveredRole(r.role)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => handleLogin(r.role)}
              >
                <div
                  className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: r.bg }}
                >
                  <r.icon size={28} style={{ color: r.color }} />
                </div>
                <h3 className="text-xl font-black mb-1" style={{ color: '#1E3A5F' }}>
                  {r.title}
                </h3>
                <p className="text-sm font-medium mb-3" style={{ color: r.color }}>
                  {r.titleHindi}
                </p>
                <p className="text-sm mb-5 grow" style={{ color: '#64748B' }}>
                  {r.description}
                </p>
                <ul className="space-y-2 mb-6 shrink-0">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#475569' }}>
                      <div className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: r.color }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full mt-auto shrink-0 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: hoveredRole === r.role ? r.color : `${r.color}15`,
                    color: hoveredRole === r.role ? 'white' : r.color,
                  }}
                >
                  Enter as {r.title}
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════════ */}
      <section className="py-20 relative" style={{ background: '#1E3A5F' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">
              Built for the World's Largest Gathering
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Every feature engineered for the chaos and scale of Mahakumbh 2028
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl h-full flex flex-col group transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}20` }}
                >
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 relative" style={{ background: '#F97316' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: 50000, suffix: '+', label: 'Volunteers Managed', icon: Users },
              { value: 10, suffix: '', label: 'Critical Zones', icon: MapPin },
              { value: 3, suffix: 's', label: 'AI Response Time', icon: Zap },
              { value: 4, suffix: '', label: 'AI Engines', icon: Brain },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-white mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="py-10 relative" style={{ background: '#0F1E33' }}>
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.2)' }}
            >
              <Brain size={16} style={{ color: '#F97316' }} />
            </div>
            <span className="text-white font-bold">MahaSahayak AI</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Built for Mahakumbh 2028 · Powered by Google Gemini AI · Developed by Kuldeep Dhangad
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Zap size={12} style={{ color: '#F97316' }} />
            <span className="text-xs font-medium" style={{ color: '#F97316' }}>
              Google Gemini 3.5 Flash
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
