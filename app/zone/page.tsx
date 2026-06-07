'use client';

import { useState } from 'react';
import { AlertTriangle, Users, Brain, Send, CheckCircle } from 'lucide-react';
import AIThinking from '@/components/ai/AIThinking';
import WorkloadBar from '@/components/volunteers/WorkloadBar';
import BharatScoreGauge from '@/components/volunteers/BharatScoreGauge';
import { DEMO_ZONES, DEMO_VOLUNTEERS } from '@/lib/demo-data';
import { AIAssignmentResponse } from '@/types';

const MY_ZONE = DEMO_ZONES.find(z => z.id === 'z-02')!;
const ZONE_VOLUNTEERS = DEMO_VOLUNTEERS.filter(v => v.assigned_zone === 'z-02');

export default function ZonePage() {
  const [incType, setIncType] = useState('Medical Emergency');
  const [incSeverity, setIncSeverity] = useState('high');
  const [incDesc, setIncDesc] = useState('');
  const [incSubmitted, setIncSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<AIAssignmentResponse | null>(null);

  const coverage = Math.round((MY_ZONE.current_volunteer_count / MY_ZONE.required_volunteer_count) * 100);

  const handleRequestVolunteers = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone_id: MY_ZONE.id, required_skills: MY_ZONE.required_skills, volunteer_count: 5 }),
      });
      const json = await res.json();
      if (json.success) setAiData(json.data);
    } catch {}
    finally { setAiLoading(false); }
  };

  return (
    <div>
      {/* Zone Header */}
      <div className="card p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), white)', border: '1px solid rgba(249,115,22,0.15)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">{MY_ZONE.zone_code}</span>
              <span className={`badge badge-${MY_ZONE.risk_level}`}>{MY_ZONE.risk_level.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>{MY_ZONE.zone_name}</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>{MY_ZONE.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black" style={{ color: coverage < 80 ? '#DC2626' : '#16A34A' }}>
              {coverage}%
            </p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              {MY_ZONE.current_volunteer_count}/{MY_ZONE.required_volunteer_count} deployed
            </p>
          </div>
        </div>
        {coverage < 80 && (
          <div className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <AlertTriangle size={16} style={{ color: '#DC2626' }} />
            <span className="text-sm font-semibold" style={{ color: '#DC2626' }}>
              Understaffed by {MY_ZONE.required_volunteer_count - MY_ZONE.current_volunteer_count} volunteers
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volunteers in Zone */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title" style={{ marginBottom: 0 }}>My Volunteers ({ZONE_VOLUNTEERS.length})</h2>
            <button onClick={handleRequestVolunteers} className="btn-primary text-sm py-2 px-3">
              <Brain size={14} /> Request More
            </button>
          </div>

          {aiLoading && <AIThinking message="Finding volunteers..." size="sm" />}
          {aiData && !aiLoading && (
            <div className="p-3 rounded-xl mb-4"
              style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <p className="text-sm font-semibold" style={{ color: '#16A34A' }}>
                AI recommends {aiData.selected_volunteer_ids?.length} volunteers
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{aiData.coverage_summary}</p>
            </div>
          )}

          <div className="space-y-3">
            {ZONE_VOLUNTEERS.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>
                  {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{v.name}</p>
                  <WorkloadBar score={v.workload_score} showLabel={false} compact />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge badge-${v.availability === 'available' ? 'available' : v.availability === 'busy' ? 'busy' : 'break'} capitalize`}
                    style={{ fontSize: 10 }}>
                    {v.availability.replace('_', ' ')}
                  </span>
                  <BharatScoreGauge score={v.bharat_ready_score} size="sm" showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Report */}
        <div className="card p-5">
          <h2 className="section-title flex items-center gap-2">
            <AlertTriangle size={18} style={{ color: '#DC2626' }} />
            Report Incident
          </h2>
          {!incSubmitted ? (
            <div className="space-y-4">
              <div>
                <label className="label">Incident Type</label>
                <select value={incType} onChange={e => setIncType(e.target.value)} className="select-field">
                  {['Medical Emergency', 'Crowd Surge', 'Missing Person', 'Fire', 'Security Issue', 'Other'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Severity</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-0">
                  {['low', 'medium', 'high', 'critical'].map(s => (
                    <button key={s} onClick={() => setIncSeverity(s)}
                      className="py-2 rounded-xl text-xs font-bold uppercase"
                      style={{
                        background: incSeverity === s
                          ? s === 'critical' ? '#DC2626' : s === 'high' ? '#EA580C' : s === 'medium' ? '#D97706' : '#16A34A'
                          : 'rgba(0,0,0,0.04)',
                        color: incSeverity === s ? 'white' : '#94A3B8',
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={incDesc} onChange={e => setIncDesc(e.target.value)}
                  className="textarea-field" placeholder="Describe the incident..." rows={3} />
              </div>
              <button
                onClick={() => setIncSubmitted(true)}
                className={incSeverity === 'critical' ? 'btn-emergency w-full' : 'btn-primary w-full'}
              >
                <Send size={16} /> Report Incident
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle size={48} style={{ color: '#16A34A', margin: '0 auto 12px' }} />
              <p className="font-bold text-lg" style={{ color: '#1E3A5F' }}>Incident Reported</p>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                Admin notified. AI emergency protocol activated for {incSeverity} severity.
              </p>
              <button onClick={() => { setIncSubmitted(false); setIncDesc(''); }}
                className="btn-ghost mt-4 mx-auto">Report Another</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
