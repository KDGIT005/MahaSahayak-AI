'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  Zap,
  Clock,
  Users,
  CheckCircle,
  X,
  Shield,
  Navigation,
  Activity,
} from 'lucide-react';
import AIThinking from '@/components/ai/AIThinking';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { DEMO_ZONES, DEMO_INCIDENTS, DEMO_VOLUNTEERS, DEMO_SCENARIOS } from '@/lib/demo-data';
import { AIEmergencyResponse, Incident } from '@/types';

function timeAgo(ts: string) {
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function Countdown({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [remaining]);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return (
    <span className="countdown text-2xl font-black">
      {mins}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

const INCIDENT_TYPES = [
  'Medical Emergency',
  'Crowd Crush',
  'Missing Person',
  'Fire / Structural',
  'Violence / Security',
  'Other',
];

const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

export default function EmergencyPage() {
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [showSimModal, setShowSimModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Simulation form
  const [simZone, setSimZone] = useState(DEMO_ZONES[0].id);
  const [simType, setSimType] = useState(INCIDENT_TYPES[0]);
  const [simSeverity, setSimSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('critical');
  const [simDesc, setSimDesc] = useState('');
  const [simCount, setSimCount] = useState(4);

  // AI Response
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<AIEmergencyResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [responderStatuses, setResponderStatuses] = useState<string[]>([]);

  const loadScenario = (idx: number) => {
    const s = DEMO_SCENARIOS[idx];
    setSimZone(s.zone_id);
    setSimType(s.type);
    setSimSeverity(s.severity as any);
    setSimDesc(s.description);
    setSimCount(s.volunteers_needed);
  };

  const handleSubmitSim = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiData(null);
    setStepIndex(0);
    setResponderStatuses([]);
    setShowSimModal(false);
    setShowResponseModal(true);

    try {
      const res = await fetch('/api/ai/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_id: simZone,
          incident_type: simType,
          severity: simSeverity,
          description: simDesc,
          volunteers_needed: simCount,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAiData(json.data);
        // Add incident to list
        const zone = DEMO_ZONES.find((z) => z.id === simZone);
        const newInc: Incident = {
          id: `inc-${Date.now()}`,
          zone_id: simZone,
          incident_type: simType,
          description: simDesc,
          severity: simSeverity,
          status: 'responding',
          volunteers_assigned: simCount,
          created_at: new Date().toISOString(),
          zone,
        };
        setIncidents((prev) => [newInc, ...prev]);
      } else {
        setAiError(json.error || 'Emergency AI failed');
      }
    } catch (e) {
      setAiError('Network error — check your Gemini API key');
    } finally {
      setAiLoading(false);
    }
  };

  // Animate action plan steps
  useEffect(() => {
    if (!aiData?.action_plan?.length || aiLoading) return;
    setStepIndex(0);
    const timer = setInterval(() => {
      setStepIndex((i) => {
        if (i >= (aiData.action_plan?.length || 0) - 1) {
          clearInterval(timer);
          return i;
        }
        return i + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [aiData, aiLoading]);

  // Simulate responder statuses
  useEffect(() => {
    if (!aiData) return;
    const statuses = ['Notified ✓', 'En route ✓', 'Arrived ✓'];
    let i = 0;
    const t = setInterval(() => {
      setResponderStatuses((prev) => {
        if (i >= statuses.length) { clearInterval(t); return prev; }
        const next = [...prev, statuses[i++]];
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [aiData]);

  const getResponderVolunteer = (id: string) =>
    DEMO_VOLUNTEERS.find((v) => v.id === id);

  return (
    <div
      className="min-h-screen -m-6 p-6 relative"
      style={{
        background: 'linear-gradient(160deg, #0F1E33 0%, #1a0505 60%, #0F1E33 100%)',
      }}
    >
      {/* Emergency header */}
      <ScrollReveal delay={0}>
      <div
        className="flex items-center justify-between mb-6 pb-5 emergency-header"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center emergency-pulse"
            style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)' }}
          >
            <Shield size={24} style={{ color: '#DC2626' }} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white uppercase">
              Emergency Command Center
            </h1>
            <p className="text-xs font-medium" style={{ color: 'rgba(220,38,38,0.8)' }}>
              आपातकाल कमान केंद्र · Mahakumbh 2028
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo scenario buttons */}
          <div className="flex gap-2">
            {DEMO_SCENARIOS.map((s, i) => (
              <button
                key={i}
                onClick={() => { loadScenario(i); setShowSimModal(true); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: 'rgba(220,38,38,0.15)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  color: '#FCA5A5',
                }}
              >
                Demo {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSimModal(true)}
            className="btn-emergency"
          >
            🚨 Simulate Emergency
          </button>
        </div>
      </div>
      </ScrollReveal>

      {/* Status bar */}
      <ScrollReveal delay={100}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Incidents', value: incidents.filter(i => i.status !== 'resolved').length, color: '#DC2626', icon: AlertTriangle },
          { label: 'Responding', value: incidents.filter(i => i.status === 'responding').length, color: '#F97316', icon: Activity },
          { label: 'Responders Out', value: 12, color: '#F59E0B', icon: Navigation },
          { label: 'Resolved Today', value: 4, color: '#16A34A', icon: CheckCircle },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <stat.icon size={16} style={{ color: stat.color }} />
              <span className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      </ScrollReveal>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Active Incidents Table */}
        <ScrollReveal delay={200} className="h-full">
        <div
          className="p-5 rounded-2xl h-full"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} style={{ color: '#DC2626' }} />
            Active Incidents
          </h2>
          <div className="space-y-3">
            {incidents.filter(i => i.status !== 'closed').map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl"
                style={{
                  background: inc.severity === 'critical'
                    ? 'rgba(220,38,38,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${
                    inc.severity === 'critical'
                      ? 'rgba(220,38,38,0.3)'
                      : 'rgba(255,255,255,0.08)'
                  }`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge badge-${inc.severity}`}>
                        {inc.severity.toUpperCase()}
                      </span>
                      <span className="text-white font-semibold text-sm">
                        {inc.incident_type}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {inc.zone?.zone_name} · {timeAgo(inc.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: inc.status === 'responding'
                          ? 'rgba(249,115,22,0.2)'
                          : 'rgba(22,163,74,0.2)',
                        color: inc.status === 'responding' ? '#F97316' : '#16A34A',
                      }}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {inc.description?.slice(0, 100)}...
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <Users size={11} className="inline mr-1" />
                    {inc.volunteers_assigned} responders assigned
                  </span>
                  <button
                    onClick={() => setShowSimModal(true)}
                    className="text-xs px-3 py-1 rounded-lg font-semibold"
                    style={{ background: 'rgba(220,38,38,0.2)', color: '#FCA5A5', border: '1px solid rgba(220,38,38,0.3)' }}
                  >
                    Deploy AI Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>

        {/* RIGHT COLUMN: AI Response or Map */}
        <ScrollReveal delay={300} className="h-full">
        {showResponseModal ? (
          <div className="p-5 rounded-2xl flex flex-col w-full h-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(220,38,38,0.4)', minHeight: '600px' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.3)' }}
                >
                  <AlertTriangle size={20} style={{ color: '#DC2626' }} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">AI Emergency Response</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {simType} · {simSeverity.toUpperCase()} · {DEMO_ZONES.find(z => z.id === simZone)?.zone_name}
                  </p>
                </div>
              </div>
            </div>

            {aiLoading && (
              <AIThinking
                message="🚨 AI analyzing emergency..."
                subtext={`Finding optimal responders for ${simType} at ${DEMO_ZONES.find(z => z.id === simZone)?.zone_name}`}
                dark
              />
            )}

            {aiError && !aiLoading && (
              <div className="text-center p-6">
                <AlertTriangle size={36} style={{ color: '#DC2626', margin: '0 auto 12px' }} />
                <p className="font-bold text-white">{aiError}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Verify GEMINI_API_KEY in .env.local
                </p>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="mt-4 btn-ghost text-white border-white/20"
                >
                  Close
                </button>
              </div>
            )}

            {aiData && !aiLoading && (
              <div className="space-y-5">
                {/* ETA Countdown */}
                <div
                  className="flex items-center justify-between p-4 rounded-2xl emergency-pulse"
                  style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)' }}
                >
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'rgba(220,38,38,0.8)' }}>
                      ESTIMATED RESPONSE TIME
                    </p>
                    <p className="text-white font-semibold text-sm mt-0.5">
                      {aiData.estimated_response_time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={20} style={{ color: '#DC2626' }} />
                    <Countdown seconds={270} />
                  </div>
                </div>

                {/* Responder Statuses */}
                {responderStatuses.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {responderStatuses.map((s, i) => (
                      <span
                        key={i}
                        className="step-item px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: 'rgba(22,163,74,0.2)',
                          color: '#4ADE80',
                          border: '1px solid rgba(22,163,74,0.3)',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Primary Responders */}
                {aiData.primary_responders?.length > 0 && (
                  <div>
                    <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                      <Zap size={16} style={{ color: '#F97316' }} />
                      Primary Responders ({aiData.primary_responders.length})
                    </h3>
                    <div className="space-y-2">
                      {aiData.primary_responders.map((id, i) => {
                        const vol = getResponderVolunteer(id);
                        if (!vol) return null;
                        return (
                          <div
                            key={id}
                            className="step-item flex items-center gap-3 p-3 rounded-xl"
                            style={{
                              background: 'rgba(249,115,22,0.1)',
                              border: '1px solid rgba(249,115,22,0.2)',
                              animationDelay: `${i * 0.15}s`,
                            }}
                          >
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                            >
                              {vol.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm">{vol.name}</p>
                              <div className="flex gap-1.5 flex-wrap mt-0.5">
                                {vol.skills.slice(0, 3).map((s) => (
                                  <span key={s} className="skill-pill" style={{ background: 'rgba(249,115,22,0.15)', color: '#FDBA74', borderColor: 'rgba(249,115,22,0.3)' }}>
                                    {s.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs font-bold" style={{ color: vol.workload_score > 70 ? '#FCA5A5' : '#4ADE80' }}>
                                {vol.workload_score}% load
                              </span>
                              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                {vol.experience_level}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Plan */}
                {aiData.action_plan?.length > 0 && (
                  <div>
                    <h3 className="text-white font-bold text-sm mb-3">Action Plan</h3>
                    <div className="space-y-2">
                      {aiData.action_plan.slice(0, stepIndex + 1).map((step, i) => (
                        <div
                          key={i}
                          className="step-item flex items-start gap-3 p-3 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            animationDelay: `${i * 0.1}s`,
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(249,115,22,0.2)', color: '#F97316' }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-sm text-white">{step}</p>
                          <CheckCircle size={16} style={{ color: '#16A34A', marginTop: 2 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {aiData.risk_assessment && (
                  <div
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                  >
                    <p className="text-xs font-bold mb-1" style={{ color: '#F59E0B' }}>
                      RISK ASSESSMENT
                    </p>
                    <p className="text-sm text-white">{aiData.risk_assessment}</p>
                  </div>
                )}

                {/* Resources */}
                {aiData.resource_requirements?.length > 0 && (
                  <div>
                    <h3 className="text-white font-bold text-sm mb-2">Resources Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiData.resource_requirements.map((r, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg text-xs font-medium"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="btn-emergency w-full"
                >
                  ✓ Response Deployed — Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Navigation size={18} style={{ color: '#F97316' }} />
              Mahakumbh Grounds — Live Map
            </h2>

            <svg viewBox="0 0 400 280" className="w-full" style={{ borderRadius: 12 }}>
              {/* Water bodies */}
              <ellipse cx="200" cy="220" rx="180" ry="50" fill="rgba(30,100,200,0.15)" />
              <text x="200" y="225" textAnchor="middle" fontSize="9" fill="rgba(100,180,255,0.7)">
                Sangam — Ganga · Yamuna · Saraswati
              </text>

              {/* Zone regions */}
              {[
                { id: 'z-01', x: 170, y: 165, label: 'Sangam', risk: 'critical', r: 24 },
                { id: 'z-02', x: 130, y: 150, label: 'Ram Ghat', risk: 'high', r: 18 },
                { id: 'z-03', x: 155, y: 130, label: 'Triveni', risk: 'critical', r: 20 },
                { id: 'z-mc1', x: 230, y: 120, label: 'Med-A', risk: 'high', r: 16 },
                { id: 'z-mc2', x: 275, y: 100, label: 'Med-B', risk: 'medium', r: 14 },
                { id: 'z-lf1', x: 310, y: 130, label: 'Lost&F', risk: 'low', r: 14 },
                { id: 'z-g01', x: 330, y: 100, label: 'Gate-1', risk: 'high', r: 14 },
                { id: 'z-pk1', x: 350, y: 75, label: 'Park-A', risk: 'low', r: 12 },
                { id: 'z-vip', x: 115, y: 110, label: 'VIP', risk: 'medium', r: 12 },
                { id: 'z-fd1', x: 230, y: 155, label: 'Food', risk: 'low', r: 14 },
              ].map((zone) => {
                const riskColors = {
                  critical: '#DC2626',
                  high: '#EA580C',
                  medium: '#D97706',
                  low: '#16A34A',
                };
                const color = riskColors[zone.risk as keyof typeof riskColors];
                const isCritical = zone.risk === 'critical';
                return (
                  <g key={zone.id}>
                    {isCritical && (
                      <circle
                        cx={zone.x}
                        cy={zone.y}
                        r={zone.r + 6}
                        fill={`${color}20`}
                        stroke={`${color}40`}
                        strokeWidth="1"
                      >
                        <animate attributeName="r" values={`${zone.r + 3};${zone.r + 10};${zone.r + 3}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={zone.x}
                      cy={zone.y}
                      r={zone.r}
                      fill={`${color}30`}
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    <text x={zone.x} y={zone.y + 1} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
                      {zone.label}
                    </text>
                  </g>
                );
              })}

              {/* Volunteer dots */}
              {DEMO_VOLUNTEERS.filter((v) => v.availability === 'available').slice(0, 12).map((v, i) => {
                const x = 100 + (i % 6) * 35 + Math.random() * 10;
                const y = 55 + Math.floor(i / 6) * 20 + Math.random() * 8;
                return (
                  <circle key={v.id} cx={x} cy={y} r="4" fill="#16A34A" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}

              {/* Legend */}
              <g transform="translate(10, 10)">
                {[
                  { color: '#DC2626', label: 'Critical' },
                  { color: '#EA580C', label: 'High' },
                  { color: '#D97706', label: 'Medium' },
                  { color: '#16A34A', label: 'Safe' },
                ].map((l, i) => (
                  <g key={l.label} transform={`translate(0, ${i * 16})`}>
                    <circle cx="5" cy="0" r="5" fill={`${l.color}40`} stroke={l.color} strokeWidth="1.5" />
                    <text x="14" y="4" fontSize="9" fill="rgba(255,255,255,0.6)">{l.label}</text>
                  </g>
                ))}
              </g>
            </svg>

            {/* Zone legend */}
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO_ZONES.slice(0, 6).map((z) => (
                <span
                  key={z.id}
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: z.risk_level === 'critical' ? '#FCA5A5' : z.risk_level === 'high' ? '#FDBA74' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {z.zone_code}: {z.zone_name}
                </span>
              ))}
            </div>
          </div>
        )}
        </ScrollReveal>
      </div>

      {/* SIMULATE EMERGENCY MODAL */}
      {showSimModal && (
        <div className="modal-overlay" onClick={() => setShowSimModal(false)}>
          <div
            className="modal-content modal-content-dark max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center emergency-pulse"
                  style={{ background: 'rgba(220,38,38,0.2)' }}
                >
                  <AlertTriangle size={20} style={{ color: '#DC2626' }} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Simulate Emergency</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    AI will find optimal responders in seconds
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSimModal(false)}>
                <X size={22} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
            </div>

            {/* Quick scenarios */}
            <div className="mb-5">
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                QUICK SCENARIOS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                {DEMO_SCENARIOS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => loadScenario(i)}
                    className="p-2 rounded-xl text-xs font-medium text-left"
                    style={{
                      background: 'rgba(220,38,38,0.1)',
                      border: '1px solid rgba(220,38,38,0.25)',
                      color: '#FCA5A5',
                    }}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label text-white opacity-60">Zone</label>
                <select
                  value={simZone}
                  onChange={(e) => setSimZone(e.target.value)}
                  className="select-field"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  {DEMO_ZONES.map((z) => (
                    <option key={z.id} value={z.id} style={{ background: '#0F1E33' }}>
                      {z.zone_name} ({z.zone_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label text-white opacity-60">Incident Type</label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value)}
                  className="select-field"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t} value={t} style={{ background: '#0F1E33' }}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label text-white opacity-60">Severity</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-0">
                  {SEVERITIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSimSeverity(s)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase capitalize`}
                      style={{
                        background:
                          simSeverity === s
                            ? s === 'critical'
                              ? '#DC2626'
                              : s === 'high'
                              ? '#EA580C'
                              : s === 'medium'
                              ? '#D97706'
                              : '#16A34A'
                            : 'rgba(255,255,255,0.06)',
                        color: simSeverity === s ? 'white' : 'rgba(255,255,255,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label text-white opacity-60">Description</label>
                <textarea
                  value={simDesc}
                  onChange={(e) => setSimDesc(e.target.value)}
                  rows={3}
                  className="textarea-field"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="Describe the emergency situation..."
                />
              </div>

              <div>
                <label className="label text-white opacity-60">Responders Needed</label>
                <input
                  type="number"
                  value={simCount}
                  onChange={(e) => setSimCount(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="input-field"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                />
              </div>

              <button onClick={handleSubmitSim} className="btn-emergency w-full py-4 text-base mt-2">
                🚨 DEPLOY AI RESPONSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}