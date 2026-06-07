'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brain, Shield, MapPin, Users, Eye, EyeOff, ArrowLeft, Zap } from 'lucide-react';

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@mahasahayak.com', password: 'demo1234', name: 'Ramesh Trivedi', title: 'Admin' },
  zone_manager: { email: 'manager@mahasahayak.com', password: 'demo1234', name: 'Anjali Singh', title: 'Zone Manager' },
  volunteer: { email: 'priya.verma@mahasahayak.com', password: 'demo1234', name: 'Nurse Priya Verma', title: 'Volunteer' },
};

const roles = [
  { id: 'admin', label: 'Admin', labelHindi: 'प्रशासक', icon: Shield, color: '#1E3A5F', desc: 'Full command center access' },
  { id: 'zone_manager', label: 'Zone Manager', labelHindi: 'क्षेत्र प्रबंधक', icon: MapPin, color: '#F97316', desc: 'Zone-level management' },
  { id: 'volunteer', label: 'Volunteer', labelHindi: 'स्वयंसेवक', icon: Users, color: '#16A34A', desc: 'Personal dashboard' },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'admin';

  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(DEMO_CREDENTIALS[defaultRole as keyof typeof DEMO_CREDENTIALS]?.email || '');
  const [password, setPassword] = useState('demo1234');

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const creds = DEMO_CREDENTIALS[roleId as keyof typeof DEMO_CREDENTIALS];
    if (creds) {
      setEmail(creds.email);
      setPassword('demo1234');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Demo: store role in localStorage and redirect
    localStorage.setItem('userRole', selectedRole);
    localStorage.setItem('userName', DEMO_CREDENTIALS[selectedRole as keyof typeof DEMO_CREDENTIALS]?.name || '');
    localStorage.setItem('userEmail', email);

    await new Promise((r) => setTimeout(r, 1000)); // Simulate auth

    if (selectedRole === 'admin') router.push('/admin');
    else if (selectedRole === 'zone_manager') router.push('/zone');
    else router.push('/volunteer');
  };

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1E33 100%)',
      }}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[420px] flex-shrink-0 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 0% 100%, rgba(249,115,22,0.2) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 mb-10 text-sm font-medium"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.2)' }}
            >
              <Brain size={26} style={{ color: '#F97316' }} />
            </div>
            <div>
              <div className="text-white font-black text-xl">MahaSahayak AI</div>
              <div className="text-xs font-medium" style={{ color: '#F59E0B' }}>
                Mahakumbh 2028
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-white mb-3">Welcome back,</h2>
          <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Sign in to access your dashboard and help manage one of the world's largest gatherings.
          </p>

          <div className="space-y-3">
            {[
              'Real-time zone monitoring',
              'AI-powered deployments',
              'Emergency command center',
              'Burnout prevention',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,0.2)' }}
                >
                  <Zap size={11} style={{ color: '#F97316' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            POWERED BY
          </p>
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: '#F59E0B' }} />
            <span className="text-sm font-semibold text-white">Google Gemini 1.5 Flash</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-8"
            style={{
              background: 'white',
              boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
            }}
          >
            {/* Mobile-only back + branding */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: '#94A3B8' }}
              >
                <ArrowLeft size={14} />
                Home
              </button>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(249,115,22,0.1)' }}
                >
                  <Brain size={14} style={{ color: '#F97316' }} />
                </div>
                <span className="text-sm font-bold" style={{ color: '#1E3A5F' }}>MahaSahayak AI</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black mb-1" style={{ color: '#1E3A5F' }}>
              Sign In
            </h1>
            <p className="text-xs sm:text-sm mb-5 sm:mb-6" style={{ color: '#94A3B8' }}>
              Select your role and enter demo credentials
            </p>

            {/* Role selector */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-5 sm:mb-6 min-w-0">
              {roles.map((r) => {
                const isActive = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className="flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: isActive ? r.color : '#E2E8F0',
                      background: isActive ? `${r.color}10` : 'transparent',
                    }}
                  >
                    <r.icon size={18} style={{ color: isActive ? r.color : '#94A3B8' }} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isActive ? r.color : '#64748B' }}
                    >
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Demo credentials banner */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-5"
              style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(249,115,22,0.1)' }}>
                {selectedRoleData && <selectedRoleData.icon size={14} style={{ color: selectedRoleData.color }} />}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#1E3A5F' }}>
                  Demo: {selectedRoleData?.label}
                </p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>
                  {DEMO_CREDENTIALS[selectedRole as keyof typeof DEMO_CREDENTIALS]?.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-11"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#94A3B8' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs mt-1.5" style={{ color: '#94A3B8' }}>
                  Demo password: <code className="font-mono font-bold">demo1234</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base relative overflow-hidden"
                style={{ marginTop: '8px' }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign in as {selectedRoleData?.label}
                    <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                  </>
                )}
              </button>
            </form>

            <div className="divider mt-6 mb-4" />
            <p className="text-center text-xs" style={{ color: '#94A3B8' }}>
              Mahakumbh 2028 · Expert Hire × VIT Bhopal · Powered by Gemini AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#1E3A5F' }} />}>
      <LoginForm />
    </Suspense>
  );
}
