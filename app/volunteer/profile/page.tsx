'use client';

import { DEMO_VOLUNTEERS } from '@/lib/demo-data';
import BharatScoreGauge from '@/components/volunteers/BharatScoreGauge';
import WorkloadBar from '@/components/volunteers/WorkloadBar';

const ME = DEMO_VOLUNTEERS[1];

export default function VolunteerProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: '#1E3A5F' }}>My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white"
              style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}>
              {ME.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ color: '#1E3A5F' }}>{ME.name}</h2>
              <p className="text-sm capitalize" style={{ color: '#94A3B8' }}>{ME.experience_level} · Age {ME.age}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Email', value: ME.email || '—' },
              { label: 'Phone', value: ME.phone || '—' },
              { label: 'Experience', value: ME.experience_level },
              { label: 'Hours Worked', value: `${ME.hours_worked}h today` },
            ].map(f => (
              <div key={f.label}>
                <span className="label">{f.label}</span>
                <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="section-title">Skills & Readiness</h2>
          <div className="flex justify-center mb-4">
            <BharatScoreGauge score={ME.bharat_ready_score} size="lg" />
          </div>
          <WorkloadBar score={ME.workload_score} />
          <div className="mt-4">
            <p className="label">Skills</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ME.skills.map(s => <span key={s} className="skill-pill">{s.replace('_', ' ')}</span>)}
            </div>
          </div>
          <div className="mt-3">
            <p className="label">Languages</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ME.languages.map(l => <span key={l} className="lang-pill capitalize">{l}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
