'use client';

import { DEMO_VOLUNTEERS } from '@/lib/demo-data';
import WorkloadBar from '@/components/volunteers/WorkloadBar';
import BharatScoreGauge from '@/components/volunteers/BharatScoreGauge';

const ZONE_VOLUNTEERS = DEMO_VOLUNTEERS.filter(v => v.assigned_zone === 'z-02');

export default function ZoneVolunteersPage() {
  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: '#1E3A5F' }}>
        Zone Volunteers — Ram Ghat
      </h1>
      <div className="card overflow-x-auto min-w-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Workload</th>
              <th>BRS</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {ZONE_VOLUNTEERS.map(v => (
              <tr key={v.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>
                      {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{v.name}</p>
                      <p className="text-xs capitalize" style={{ color: '#94A3B8' }}>{v.experience_level}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {v.skills.slice(0, 2).map(s => <span key={s} className="skill-pill">{s.replace('_', ' ')}</span>)}
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${v.availability === 'available' ? 'available' : v.availability === 'busy' ? 'busy' : 'break'} capitalize`}>
                    {v.availability.replace('_', ' ')}
                  </span>
                </td>
                <td className="min-w-28"><WorkloadBar score={v.workload_score} /></td>
                <td><BharatScoreGauge score={v.bharat_ready_score} size="sm" showLabel={false} /></td>
                <td><span className="font-semibold" style={{ color: '#1E3A5F' }}>{v.hours_worked}h</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
