'use client';

import { useState, useEffect } from 'react';
import BharatScoreGauge from '@/components/volunteers/BharatScoreGauge';
import WorkloadBar from '@/components/volunteers/WorkloadBar';
import { DEMO_VOLUNTEERS, DEMO_ZONES } from '@/lib/demo-data';
import { Bell, MapPin, Clock, CheckCircle, Activity, Star } from 'lucide-react';

const ME = DEMO_VOLUNTEERS[1]; // Nurse Priya Verma (demo volunteer)
const MY_ZONE = DEMO_ZONES.find(z => z.id === ME.assigned_zone);

const NOTIFICATIONS = [
  { id: 1, title: 'New assignment: Medical Camp Alpha', type: 'assignment', time: '10m ago', read: false },
  { id: 2, title: 'Shift starts in 30 minutes', type: 'info', time: '28m ago', read: false },
  { id: 3, title: 'Emergency at Ram Ghat — stand by', type: 'emergency', time: '1h ago', read: true },
];

type AvailStatus = 'available' | 'busy' | 'on_break' | 'offline';

export default function VolunteerDashboard() {
  const [availability, setAvailability] = useState<AvailStatus>(ME.availability);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const availOptions: AvailStatus[] = ['available', 'busy', 'on_break', 'offline'];

  const availColors: Record<AvailStatus, string> = {
    available: '#16A34A', busy: '#EA580C', on_break: '#D97706', offline: '#6B7280',
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>
          नमस्ते, {ME.name.split(' ')[0]}! 🙏
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
          Mahakumbh 2028 · Your volunteer portal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile + BRS Card */}
        <div className="card p-6 flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.05), white)', border: '1px solid rgba(22,163,74,0.15)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white mb-4"
            style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)', boxShadow: '0 8px 24px rgba(22,163,74,0.3)' }}>
            {ME.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <h2 className="text-lg font-black mb-0.5" style={{ color: '#1E3A5F' }}>{ME.name}</h2>
          <p className="text-sm mb-3" style={{ color: '#64748B' }}>
            {ME.experience_level.charAt(0).toUpperCase() + ME.experience_level.slice(1)} Volunteer
          </p>

          {/* BRS Gauge */}
          <div className="my-3">
            <BharatScoreGauge score={ME.bharat_ready_score} size="lg" />
          </div>
          <p className="text-xs text-center mt-2" style={{ color: '#94A3B8', maxWidth: 180 }}>
            Your readiness score based on skills, experience, and response history
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-4">
            {ME.skills.map(s => <span key={s} className="skill-pill">{s.replace('_', ' ')}</span>)}
          </div>
          {/* Languages */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            {ME.languages.map(l => <span key={l} className="lang-pill capitalize">{l}</span>)}
          </div>
        </div>

        {/* Center col */}
        <div className="flex flex-col gap-5">
          {/* Availability Toggle */}
          <div className="card p-5">
            <h2 className="section-title">My Availability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
              {availOptions.map(status => (
                <button
                  key={status}
                  onClick={() => setAvailability(status)}
                  className="py-3 rounded-xl font-semibold text-sm capitalize transition-all"
                  style={{
                    background: availability === status ? availColors[status] : `${availColors[status]}12`,
                    color: availability === status ? 'white' : availColors[status],
                    border: `1.5px solid ${availability === status ? availColors[status] : `${availColors[status]}30`}`,
                    transform: availability === status ? 'scale(1.02)' : undefined,
                  }}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
            <p className="text-xs mt-3 text-center" style={{ color: '#94A3B8' }}>
              Status updates in real-time across the platform
            </p>
          </div>

          {/* Current Assignment */}
          {MY_ZONE && (
            <div className="card p-5"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.05), white)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <h2 className="section-title">Current Assignment</h2>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={15} style={{ color: '#F97316' }} />
                <span className="font-bold" style={{ color: '#1E3A5F' }}>{MY_ZONE.zone_name}</span>
                <span className={`badge badge-${MY_ZONE.risk_level}`}>{MY_ZONE.risk_level.toUpperCase()}</span>
              </div>
              <p className="text-sm mb-3" style={{ color: '#64748B' }}>
                Medical support — Morning shift (6:00 AM – 2:00 PM)
              </p>
              <div className="flex gap-2">
                <button className="btn-primary flex-1 py-2 text-sm">
                  <CheckCircle size={14} /> Mark Complete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-5">
          {/* Stats */}
          <div className="card p-5">
            <h2 className="section-title">Today's Stats</h2>
            <div className="space-y-4">
              {[
                { label: 'Hours Worked', value: `${ME.hours_worked}h`, icon: Clock, color: '#1E3A5F' },
                { label: 'Active Assignments', value: ME.active_assignments, icon: Activity, color: '#F97316' },
                { label: 'Bharat Score', value: ME.bharat_ready_score, icon: Star, color: '#16A34A' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${stat.color}12` }}>
                      <stat.icon size={16} style={{ color: stat.color }} />
                    </div>
                    <span className="text-sm" style={{ color: '#64748B' }}>{stat.label}</span>
                  </div>
                  <span className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="divider mt-4 mb-3" />
            <div>
              <p className="label">Workload</p>
              <WorkloadBar score={ME.workload_score} />
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Notifications</h2>
              <button onClick={markAllRead} className="text-xs font-medium"
                style={{ color: '#F97316' }}>Mark all read</button>
            </div>
            <div className="space-y-2">
              {notifications.map(n => (
                <div key={n.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background: n.read ? 'transparent' : 'rgba(249,115,22,0.05)',
                    border: n.read ? '1px solid transparent' : '1px solid rgba(249,115,22,0.12)',
                  }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: n.type === 'emergency' ? 'rgba(220,38,38,0.12)'
                        : n.type === 'assignment' ? 'rgba(249,115,22,0.12)'
                        : 'rgba(22,163,74,0.12)',
                    }}>
                    <Bell size={13} style={{
                      color: n.type === 'emergency' ? '#DC2626' : n.type === 'assignment' ? '#F97316' : '#16A34A'
                    }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: n.read ? '#94A3B8' : '#1E3A5F' }}>
                      {n.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{n.time}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#F97316' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
