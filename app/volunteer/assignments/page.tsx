'use client';

import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { DEMO_ZONES } from '@/lib/demo-data';

const ASSIGNMENTS = [
  { id: 'a1', zone: 'Medical Camp Alpha', task: 'Triage support', shift: '6:00 AM – 2:00 PM', status: 'active', priority: 'high' },
  { id: 'a2', zone: 'Ram Ghat', task: 'Information desk', shift: '2:00 PM – 10:00 PM', status: 'pending', priority: 'normal' },
];

export default function VolunteerAssignmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: '#1E3A5F' }}>My Assignments</h1>
      <div className="space-y-4">
        {ASSIGNMENTS.map(a => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} style={{ color: '#F97316' }} />
                  <span className="font-bold" style={{ color: '#1E3A5F' }}>{a.zone}</span>
                  <span className={`badge badge-${a.priority === 'high' ? 'high' : 'low'}`}>{a.priority}</span>
                </div>
                <p className="text-sm" style={{ color: '#64748B' }}>{a.task}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-bold capitalize"
                style={{
                  background: a.status === 'active' ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                  color: a.status === 'active' ? '#16A34A' : '#D97706',
                }}>
                {a.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
                <Clock size={12} /> {a.shift}
              </span>
              {a.status === 'active' && (
                <button className="btn-primary text-xs py-1.5 px-4">
                  <CheckCircle size={13} /> Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
