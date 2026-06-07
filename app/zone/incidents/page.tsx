'use client';

import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { DEMO_INCIDENTS } from '@/lib/demo-data';

export default function ZoneIncidentsPage() {
  const zoneIncidents = DEMO_INCIDENTS.filter(i => i.zone_id === 'z-02');

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: '#1E3A5F' }}>
        Incidents — Ram Ghat
      </h1>
      <div className="space-y-4">
        {zoneIncidents.length === 0 ? (
          <div className="card p-10 text-center">
            <CheckCircle size={40} style={{ color: '#16A34A', margin: '0 auto 12px' }} />
            <p className="font-semibold" style={{ color: '#1E3A5F' }}>No active incidents</p>
            <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>All clear at Ram Ghat</p>
          </div>
        ) : zoneIncidents.map(inc => (
          <div key={inc.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                  <span className="font-bold" style={{ color: '#1E3A5F' }}>{inc.incident_type}</span>
                </div>
                <p className="text-sm" style={{ color: '#64748B' }}>{inc.description}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-semibold capitalize"
                style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}>
                {inc.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: '#94A3B8' }}>
              <span className="flex items-center gap-1"><Clock size={12} />{new Date(inc.created_at).toLocaleTimeString()}</span>
              <span>{inc.volunteers_assigned} responders</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
