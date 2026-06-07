'use client';

import { useState } from 'react';
import ZoneCard from '@/components/zones/ZoneCard';
import AIThinking from '@/components/ai/AIThinking';
import { DEMO_ZONES, DEMO_VOLUNTEERS } from '@/lib/demo-data';
import { AIAssignmentResponse } from '@/types';
import { Brain, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function ZonesPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<AIAssignmentResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOptimizeZone = async (zoneId: string) => {
    setSelectedZone(zoneId);
    setShowModal(true);
    setAiLoading(true);
    setAiData(null);
    setAiError(null);
    const zone = DEMO_ZONES.find(z => z.id === zoneId)!;
    try {
      const res = await fetch('/api/ai/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone_id: zoneId, required_skills: zone.required_skills, volunteer_count: 5 }),
      });
      const json = await res.json();
      if (json.success) setAiData(json.data);
      else setAiError(json.error);
    } catch { setAiError('Network error'); }
    finally { setAiLoading(false); }
  };

  const zone = DEMO_ZONES.find(z => z.id === selectedZone);
  const critical = DEMO_ZONES.filter(z => z.risk_level === 'critical');
  const high = DEMO_ZONES.filter(z => z.risk_level === 'high');
  const medium = DEMO_ZONES.filter(z => z.risk_level === 'medium');
  const low = DEMO_ZONES.filter(z => z.risk_level === 'low');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>Zone Management</h1>
          <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
            {DEMO_ZONES.length} active zones · {critical.length} critical · {high.length} high risk
          </p>
        </div>
      </div>

      {/* Critical Zones */}
      {critical.length > 0 && (
        <div className="mb-6">
          <h2 className="section-title flex items-center gap-2">
            <AlertTriangle size={18} style={{ color: '#DC2626' }} />
            Critical Zones — Immediate Attention Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {critical.map(z => (
              <div key={z.id}>
                <ZoneCard zone={z} onClick={() => handleOptimizeZone(z.id)} />
                <button
                  onClick={() => handleOptimizeZone(z.id)}
                  className="btn-emergency w-full mt-2 py-2.5 text-sm"
                >
                  <Brain size={15} /> AI Assign Volunteers
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High Risk */}
      {high.length > 0 && (
        <div className="mb-6">
          <h2 className="section-title">High Risk Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {high.map(z => (
              <div key={z.id}>
                <ZoneCard zone={z} onClick={() => handleOptimizeZone(z.id)} />
                <button onClick={() => handleOptimizeZone(z.id)} className="btn-primary w-full mt-2 py-2 text-sm">
                  <Brain size={14} /> AI Optimize
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium + Low */}
      <div>
        <h2 className="section-title">Other Zones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...medium, ...low].map(z => (
            <ZoneCard key={z.id} zone={z} onClick={() => handleOptimizeZone(z.id)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !aiLoading && setShowModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black" style={{ color: '#1E3A5F' }}>
                  AI Assignment — {zone?.zone_name}
                </h2>
                <span className={`badge badge-${zone?.risk_level} mt-1`}>{zone?.risk_level?.toUpperCase()}</span>
              </div>
              {!aiLoading && <button onClick={() => setShowModal(false)}><X size={20} style={{ color: '#94A3B8' }} /></button>}
            </div>

            {aiLoading && <AIThinking message={`Finding volunteers for ${zone?.zone_name}...`} subtext="Matching skills, languages, and workload" />}

            {aiError && !aiLoading && (
              <div className="text-center p-4">
                <AlertTriangle size={28} style={{ color: '#DC2626', margin: '0 auto 8px' }} />
                <p style={{ color: '#DC2626' }}>{aiError}</p>
              </div>
            )}

            {aiData && !aiLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Confidence</p>
                    <p className="text-2xl font-black" style={{ color: '#16A34A' }}>
                      {Math.round((aiData.confidence_score || 0) * 100)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Shift</p>
                    <p className="font-semibold capitalize" style={{ color: '#1E3A5F' }}>{aiData.shift_recommendation}</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#64748B' }}>{aiData.coverage_summary}</p>
                {aiData.warnings?.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <AlertTriangle size={13} style={{ color: '#D97706', marginTop: 1 }} />
                    <p className="text-xs" style={{ color: '#D97706' }}>{w}</p>
                  </div>
                ))}
                {aiData.selected_volunteer_ids?.map(id => {
                  const vol = DEMO_VOLUNTEERS.find(v => v.id === id);
                  if (!vol) return null;
                  return (
                    <div key={id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>
                        {vol.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{vol.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {vol.skills.slice(0, 3).map(s => <span key={s} className="skill-pill">{s.replace('_', ' ')}</span>)}
                        </div>
                      </div>
                      <span className="text-xs font-bold" style={{ color: vol.workload_score > 70 ? '#DC2626' : '#16A34A' }}>
                        {vol.workload_score}%
                      </span>
                    </div>
                  );
                })}
                <button onClick={() => setShowModal(false)} className="btn-primary w-full">
                  <CheckCircle size={16} /> Apply Assignments
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
