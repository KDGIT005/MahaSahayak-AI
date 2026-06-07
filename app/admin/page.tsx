'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Brain,
  TrendingUp,
  Zap,
  X,
  MapPin,
  ArrowRight
} from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import ZoneCard from '@/components/zones/ZoneCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import AIThinking from '@/components/ai/AIThinking';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  DEMO_ZONES,
  DEMO_VOLUNTEERS,
  DEMO_INCIDENTS,
  DEMO_ACTIVITY,
} from '@/lib/demo-data';
import { AIBalanceResponse } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<AIBalanceResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [activity, setActivity] = useState(DEMO_ACTIVITY);

  const totalVolunteers = DEMO_VOLUNTEERS.length;
  const activeVolunteers = DEMO_VOLUNTEERS.filter((v) => v.availability !== 'offline').length;
  const availableVolunteers = DEMO_VOLUNTEERS.filter((v) => v.availability === 'available').length;
  const openIncidents = DEMO_INCIDENTS.filter((i) => i.status !== 'closed' && i.status !== 'resolved').length;
  const totalRequired = DEMO_ZONES.reduce((a, z) => a + z.required_volunteer_count, 0);
  const totalCurrent = DEMO_ZONES.reduce((a, z) => a + z.current_volunteer_count, 0);
  const coveragePercent = Math.round((totalCurrent / totalRequired) * 100);
  const burnoutCount = DEMO_VOLUNTEERS.filter((v) => v.workload_score > 85).length;

  const handleAIOptimize = async () => {
    setAiLoading(true);
    setAiError(null);
    setShowAiModal(true);
    try {
      const res = await fetch('/api/ai/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteers: DEMO_VOLUNTEERS }),
      });
      const json = await res.json();
      if (json.success) {
        setAiData(json.data);
        // Add to activity
        setActivity((prev) => [
          {
            id: `act-ai-${Date.now()}`,
            type: 'ai',
            title: 'AI Workload Analysis Complete',
            description: `Health score: ${json.data.overall_health_score}/100. ${json.data.critical_alerts?.length || 0} alerts.`,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        setAiError(json.error || 'AI analysis failed');
      }
    } catch (e) {
      setAiError('Network error — check your Gemini API key');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>
            Central Command Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
            Mahakumbh 2028 · Real-time volunteer operations overview
          </p>
        </div>
        <button
          onClick={handleAIOptimize}
          disabled={aiLoading}
          className="btn-primary flex items-center gap-2"
        >
          <Brain size={18} />
          🤖 AI Optimize All
        </button>
      </div>

      {/* Metrics Bar */}
      <ScrollReveal delay={0}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          title="Total Volunteers"
          value={totalVolunteers}
          subtitle="Registered"
          icon={Users}
          color="navy"
          trendValue="+12 today"
          trend="up"
        />
        <MetricCard
          title="Active Now"
          value={activeVolunteers}
          subtitle="On duty"
          icon={Activity}
          color="saffron"
          trendValue="87% of total"
          trend="up"
        />
        <MetricCard
          title="Available"
          value={availableVolunteers}
          subtitle="Ready to deploy"
          icon={CheckCircle}
          color="green"
          trendValue="Can be assigned"
          trend="neutral"
        />
        <MetricCard
          title="Open Incidents"
          value={openIncidents}
          subtitle="Requires action"
          icon={AlertTriangle}
          color={openIncidents > 0 ? 'red' : 'green'}
          trendValue={openIncidents > 0 ? 'Urgent' : 'All clear'}
          trend={openIncidents > 0 ? 'up' : 'neutral'}
        />
        <MetricCard
          title="Coverage"
          value={coveragePercent}
          suffix="%"
          subtitle="Zone coverage"
          icon={BarChart3}
          color={coveragePercent >= 80 ? 'green' : 'amber'}
          trendValue={`${totalCurrent}/${totalRequired} deployed`}
          trend={coveragePercent >= 80 ? 'up' : 'down'}
        />
      </div>
      </ScrollReveal>

      {/* Burnout Alert Banner */}
      {burnoutCount > 0 && (
        <ScrollReveal delay={100}>
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6 burnout-pulse"
          style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.25)',
          }}
        >
          <AlertTriangle size={20} style={{ color: '#DC2626' }} />
          <div className="flex-1">
            <span className="font-bold text-sm" style={{ color: '#DC2626' }}>
              ⚠ {burnoutCount} volunteer{burnoutCount > 1 ? 's' : ''} at BURNOUT RISK
            </span>
            <span className="text-sm ml-2" style={{ color: '#64748B' }}>
              Col. Vijay Rawat (91%), Dr. Sunita Tripathi (88%) — Immediate rotation recommended
            </span>
          </div>
          <button onClick={handleAIOptimize} className="btn-primary text-xs py-1.5 px-3">
            AI Fix Now
          </button>
        </div>
        </ScrollReveal>
      )}

      {/* Quick Actions Panel */}
      <ScrollReveal delay={100}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => router.push('/admin/ai-engine')}
          className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105"
          style={{ background: '#1E3A5F', color: 'white', border: '1px solid #2D5A8E' }}
        >
          <div className="flex items-center gap-3">
            <Brain size={24} style={{ color: '#F97316' }} />
            <div className="text-left">
              <p className="font-bold">Smart AI Assignment</p>
              <p className="text-xs text-white/70">Deploy volunteers to zones</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-white/50" />
        </button>

        <button
          onClick={() => router.push('/admin/emergency')}
          className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105"
          style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} style={{ color: '#DC2626' }} />
            <div className="text-left">
              <p className="font-bold text-red-700">Emergency Response</p>
              <p className="text-xs text-red-600/70">View live incidents</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-red-500/50" />
        </button>

        <button
          onClick={() => router.push('/admin/volunteers')}
          className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105"
          style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <Users size={24} style={{ color: '#16A34A' }} />
            <div className="text-left">
              <p className="font-bold text-green-700">Manage Volunteers</p>
              <p className="text-xs text-green-600/70">View all profiles</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-green-500/50" />
        </button>
      </div>
      </ScrollReveal>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">

        {/* Col 1: Zone Risk Heatmap + AI Insights */}
        <div className="flex flex-col gap-6">
          <ScrollReveal delay={200}>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Zone Risk Heatmap
              </h2>
              <span className="badge badge-critical flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#DC2626', animation: 'pulse-red 1s infinite' }}
                />
                2 Critical
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              {DEMO_ZONES.map((zone) => (
                <ZoneCard key={zone.id} zone={zone} compact />
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* AI Insights */}
          <ScrollReveal delay={500}>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} style={{ color: '#F97316' }} />
              <h2 className="section-title" style={{ marginBottom: 0 }}>AI Insights</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: AlertTriangle,
                  color: '#DC2626',
                  bg: 'rgba(220,38,38,0.08)',
                  text: `${burnoutCount} volunteers at burnout risk — rotate immediately`,
                },
                {
                  icon: TrendingUp,
                  color: '#16A34A',
                  bg: 'rgba(22,163,74,0.08)',
                  text: `${availableVolunteers} volunteers available for immediate deployment`,
                },
                {
                  icon: MapPin,
                  color: '#F97316',
                  bg: 'rgba(249,115,22,0.08)',
                  text: 'Sangam Ghat & Triveni Crossing critically understaffed (46%, 45%)',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: item.bg, border: `1px solid ${item.color}20` }}
                >
                  <item.icon size={15} style={{ color: item.color, flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={handleAIOptimize}
              disabled={aiLoading}
              className="btn-primary w-full mt-4 py-2.5 text-sm"
            >
              <Brain size={15} />
              Run Full AI Analysis
            </button>
          </div>
          </ScrollReveal>
        </div>

        {/* Col 2: Activity Feed + Incidents */}
        <div className="flex flex-col gap-5">
          {/* Active Incidents */}
          <ScrollReveal delay={300}>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Active Incidents
              </h2>
              <span className="badge badge-critical">{openIncidents} Open</span>
            </div>
            <div className="space-y-3">
              {DEMO_INCIDENTS.filter((i) => i.status !== 'resolved').map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background:
                      inc.severity === 'critical'
                        ? 'rgba(220,38,38,0.06)'
                        : 'rgba(234,88,12,0.05)',
                    border: `1px solid ${
                      inc.severity === 'critical'
                        ? 'rgba(220,38,38,0.2)'
                        : 'rgba(234,88,12,0.15)'
                    }`,
                  }}
                >
                  <AlertTriangle
                    size={16}
                    style={{
                      color:
                        inc.severity === 'critical' ? '#DC2626' : '#EA580C',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`badge badge-${inc.severity}`}
                        style={{ fontSize: '10px', padding: '1px 6px' }}
                      >
                        {inc.severity.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold truncate" style={{ color: '#1E3A5F' }}>
                        {inc.incident_type}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {inc.zone?.zone_name} · {inc.volunteers_assigned} responders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Live Activity Feed */}
          <ScrollReveal delay={400} className="flex flex-col min-h-0 flex-1">
          <div className="card p-5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Live Activity
              </h2>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#16A34A', animation: 'ai-pulse 1.5s infinite' }}
                />
                <span className="text-xs font-medium" style={{ color: '#16A34A' }}>
                  Live
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
              <ActivityFeed items={activity.slice(0, 8)} />
            </div>
          </div>
          </ScrollReveal>
        </div>


      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="modal-overlay" onClick={() => !aiLoading && setShowAiModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black" style={{ color: '#1E3A5F' }}>
                  AI Workforce Analysis
                </h2>
                <p className="text-sm" style={{ color: '#94A3B8' }}>
                  Powered by Google Gemini 1.5 Flash
                </p>
              </div>
              {!aiLoading && (
                <button onClick={() => setShowAiModal(false)}>
                  <X size={22} style={{ color: '#94A3B8' }} />
                </button>
              )}
            </div>

            {aiLoading && (
              <AIThinking
                message="Analyzing 30 volunteer profiles..."
                subtext="Evaluating workload, skills, burnout risks, and rebalancing options"
              />
            )}

            {aiError && !aiLoading && (
              <div
                className="p-4 rounded-xl text-center"
                style={{ background: 'rgba(220,38,38,0.08)' }}
              >
                <AlertTriangle size={28} style={{ color: '#DC2626', margin: '0 auto 12px' }} />
                <p className="font-semibold" style={{ color: '#DC2626' }}>
                  {aiError}
                </p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                  Check your GEMINI_API_KEY in .env.local
                </p>
              </div>
            )}

            {aiData && !aiLoading && (
              <div className="space-y-5">
                {/* Health Score */}
                <div className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <div>
                    <p className="text-4xl font-black" style={{ color: '#16A34A' }}>
                      {aiData.overall_health_score}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>Overall Health Score</p>
                  </div>
                  <div>
                    <span className="badge badge-medium capitalize">{aiData.health_status}</span>
                    <p className="text-xs mt-2" style={{ color: '#64748B' }}>
                      {aiData.critical_alerts?.length || 0} critical alerts
                    </p>
                  </div>
                </div>

                {/* Critical Alerts */}
                {aiData.critical_alerts?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#1E3A5F' }}>
                      🚨 Critical Alerts
                    </h3>
                    {aiData.critical_alerts.map((alert, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg mb-2"
                        style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
                        <AlertTriangle size={13} style={{ color: '#DC2626', marginTop: 1 }} />
                        <p className="text-xs" style={{ color: '#DC2626' }}>{alert}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Burnout Risks */}
                {aiData.burnout_risks?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#1E3A5F' }}>
                      Burnout Risks ({aiData.burnout_risks.length})
                    </h3>
                    {aiData.burnout_risks.map((risk, i) => (
                      <div key={i} className="p-3 rounded-xl mb-2"
                        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>
                            {risk.name}
                          </span>
                          <span className={`badge badge-${risk.risk_level === 'critical' ? 'critical' : 'high'}`}>
                            {risk.workload_score}%
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: '#64748B' }}>
                          {risk.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rebalancing */}
                {aiData.rebalancing_suggestions?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#1E3A5F' }}>
                      Rebalancing Suggestions
                    </h3>
                    {aiData.rebalancing_suggestions.map((sug, i) => (
                      <div key={i} className="p-3 rounded-xl mb-2"
                        style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
                        <p className="text-sm font-semibold" style={{ color: '#EA580C' }}>{sug.action}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{sug.reason}</p>
                        <p className="text-xs mt-0.5 font-medium" style={{ color: '#16A34A' }}>Impact: {sug.impact}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => setShowAiModal(false)} className="btn-primary w-full">
                  Apply Recommendations ✓
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
