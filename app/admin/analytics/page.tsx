'use client';

import { DEMO_VOLUNTEERS, DEMO_ZONES, getWorkloadColor } from '@/lib/demo-data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Users, MapPin, Activity, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const zoneCoverageData = DEMO_ZONES.map(z => ({
    name: z.zone_code,
    current: z.current_volunteer_count,
    required: z.required_volunteer_count,
    coverage: Math.round((z.current_volunteer_count / z.required_volunteer_count) * 100),
  }));

  const skillDistribution: Record<string, number> = {};
  DEMO_VOLUNTEERS.forEach(v => v.skills.forEach(s => {
    skillDistribution[s] = (skillDistribution[s] || 0) + 1;
  }));
  const skillData = Object.entries(skillDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  const availData = [
    { name: 'Available', value: DEMO_VOLUNTEERS.filter(v => v.availability === 'available').length, color: '#16A34A' },
    { name: 'Busy', value: DEMO_VOLUNTEERS.filter(v => v.availability === 'busy').length, color: '#EA580C' },
    { name: 'On Break', value: DEMO_VOLUNTEERS.filter(v => v.availability === 'on_break').length, color: '#D97706' },
    { name: 'Offline', value: DEMO_VOLUNTEERS.filter(v => v.availability === 'offline').length, color: '#6B7280' },
  ];

  const workloadTrend = [
    { time: '06:00', avg: 28 }, { time: '08:00', avg: 42 }, { time: '10:00', avg: 55 },
    { time: '12:00', avg: 61 }, { time: '14:00', avg: 58 }, { time: '16:00', avg: 67 },
    { time: '18:00', avg: 72 }, { time: '20:00', avg: 65 }, { time: '22:00', avg: 48 },
  ];

  const expData = [
    { name: 'Expert', value: DEMO_VOLUNTEERS.filter(v => v.experience_level === 'expert').length, color: '#1E3A5F' },
    { name: 'Intermediate', value: DEMO_VOLUNTEERS.filter(v => v.experience_level === 'intermediate').length, color: '#F97316' },
    { name: 'Beginner', value: DEMO_VOLUNTEERS.filter(v => v.experience_level === 'beginner').length, color: '#94A3B8' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>Analytics & Reports</h1>
        <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
          Real-time workforce intelligence · Mahakumbh 2028
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg Workload', value: `${Math.round(DEMO_VOLUNTEERS.reduce((a,v) => a + v.workload_score, 0) / DEMO_VOLUNTEERS.length)}%`, icon: Activity, color: '#F97316' },
          { label: 'Total Hours Worked', value: `${DEMO_VOLUNTEERS.reduce((a,v) => a + v.hours_worked, 0).toFixed(0)}h`, icon: TrendingUp, color: '#1E3A5F' },
          { label: 'Expert Volunteers', value: expData[0].value, icon: Users, color: '#16A34A' },
          { label: 'Zones Covered', value: DEMO_ZONES.filter(z => z.current_volunteer_count > 0).length, icon: MapPin, color: '#D97706' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <k.icon size={18} style={{ color: k.color }} />
              <span className="text-2xl font-black" style={{ color: k.color }}>{k.value}</span>
            </div>
            <p className="text-xs" style={{ color: '#94A3B8' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Coverage Bar */}
        <div className="card p-5">
          <h2 className="section-title">Zone Coverage vs Required</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={zoneCoverageData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #E2E8F0' }}
                formatter={(val, name) => [val, name === 'current' ? 'Deployed' : 'Required']}
              />
              <Bar dataKey="required" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="required" />
              <Bar dataKey="current" fill="#F97316" radius={[4, 4, 0, 0]} name="current" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Workload trend */}
        <div className="card p-5">
          <h2 className="section-title">Average Workload Trend (Today)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={workloadTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: 10, fontSize: 12 }}
                formatter={(val) => [`${val}%`, 'Avg Workload']}
              />
              <Line
                type="monotone" dataKey="avg" stroke="#F97316" strokeWidth={2.5}
                dot={{ fill: '#F97316', r: 4 }} activeDot={{ r: 6 }}
              />
              {/* Burnout threshold line */}
              <Line type="monotone" dataKey={() => 85} stroke="#DC2626" strokeWidth={1.5}
                strokeDasharray="4 4" dot={false} name="Burnout Threshold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Availability distribution */}
        <div className="card p-5">
          <h2 className="section-title">Availability Distribution</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={availData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {availData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {availData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>{d.value}</span>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Distribution */}
        <div className="card p-5">
          <h2 className="section-title">Volunteer Skill Coverage</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} width={70} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }}
                formatter={(val) => [val, 'Volunteers']} />
              <Bar dataKey="value" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
