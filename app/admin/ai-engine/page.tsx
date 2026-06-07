'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  Search,
  Users,
  Activity,
  BarChart3,
  Calendar,
  Send,
  CheckCircle,
  AlertTriangle,
  X,
  Zap,
  RefreshCw,
  Clock,
} from 'lucide-react';
import AIThinking from '@/components/ai/AIThinking';
import BharatScoreGauge from '@/components/volunteers/BharatScoreGauge';
import WorkloadBar from '@/components/volunteers/WorkloadBar';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { DEMO_VOLUNTEERS, DEMO_ZONES } from '@/lib/demo-data';
import { AIBalanceResponse, AIQueryResponse, AIAssignmentResponse, Volunteer } from '@/types';

const EXAMPLE_QUERIES = [
  'Find Hindi-speaking medical volunteers available now',
  'Which zones are understaffed for crowd management?',
  'Who has been working the longest shift today?',
  'Show expert volunteers available in Sangam Ghat',
  'Find multilingual volunteers for Lost & Found',
];

const AI_INSIGHTS = [
  '2 volunteers at burnout risk — Col. Vijay Rawat (91%) and Dr. Sunita Tripathi (88%) need immediate rotation.',
  'Sangam Ghat is only 46% staffed. 12 additional crowd_management volunteers should be deployed.',
  '8 beginner volunteers are underutilized (workload < 15%). Consider deploying to Food Distribution Hub.',
  'Language gap detected: No Maithili speakers currently available for northern zones.',
  'Peak bathing schedule in 2 hours — recommend pre-deploying 15 additional volunteers at Triveni Crossing.',
];

type AIMode = 'idle' | 'balance' | 'assign' | 'query';

export default function AIEnginePage() {
  const [query, setQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>('idle');
  const [error, setError] = useState<string | null>(null);

  const [balanceData, setBalanceData] = useState<AIBalanceResponse | null>(null);
  const [queryData, setQueryData] = useState<AIQueryResponse | null>(null);
  const [assignData, setAssignData] = useState<AIAssignmentResponse | null>(null);
  const [matchedVolunteers, setMatchedVolunteers] = useState<Volunteer[]>([]);
  const [insightIndex, setInsightIndex] = useState(0);
  const [selectedZone, setSelectedZone] = useState(DEMO_ZONES[0].id);

  // Rotate insights
  useEffect(() => {
    const timer = setInterval(() => {
      setInsightIndex((i) => (i + 1) % AI_INSIGHTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const clearResults = () => {
    setBalanceData(null);
    setQueryData(null);
    setAssignData(null);
    setMatchedVolunteers([]);
    setError(null);
  };

  const handleBalance = async () => {
    setLoading(true);
    setMode('balance');
    clearResults();
    try {
      const res = await fetch('/api/ai/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteers: DEMO_VOLUNTEERS }),
      });
      const json = await res.json();
      if (json.success) setBalanceData(json.data);
      else setError(json.error || 'Balance AI failed');
    } catch (e) {
      setError('Network error — check API key');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    setLoading(true);
    setMode('assign');
    clearResults();
    try {
      const zone = DEMO_ZONES.find((z) => z.id === selectedZone)!;
      const res = await fetch('/api/ai/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_id: selectedZone,
          required_skills: zone.required_skills,
          volunteer_count: 5,
        }),
      });
      const json = await res.json();
      if (json.success) setAssignData(json.data);
      else setError(json.error || 'Assignment AI failed');
    } catch (e) {
      setError('Network error — check API key');
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setMode('query');
    clearResults();
    if (!queryHistory.includes(searchQuery)) {
      setQueryHistory((prev) => [searchQuery, ...prev].slice(0, 5));
    }
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const json = await res.json();
      if (json.success) {
        setQueryData(json.data);
        const matched = DEMO_VOLUNTEERS.filter((v) =>
          json.data.matched_volunteer_ids?.includes(v.id)
        );
        setMatchedVolunteers(matched);
      } else {
        setError(json.error || 'Query failed');
      }
    } catch (e) {
      setError('Network error — check API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ScrollReveal delay={0}>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>
          Smart AI Assignment
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
          Powered by Google Gemini 3.5 Flash · Instantly deploy volunteers where they are needed most
        </p>
      </div>
      </ScrollReveal>

      {/* Rotating Insight Strip */}
      <ScrollReveal delay={100}>
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl mb-6"
        style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <Brain size={18} style={{ color: '#F97316' }} />
          <span className="text-xs font-bold uppercase" style={{ color: '#F97316' }}>
            Live Insight
          </span>
        </div>
        <div className="flex-1 text-sm" style={{ color: '#475569' }}>
          {AI_INSIGHTS[insightIndex]}
        </div>
        <RefreshCw size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
      </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — AI Actions */}
        <div className="flex flex-col gap-5">

          {/* Main Workflow: Assignment */}
          <ScrollReveal delay={200}>
          <div className="card p-6" style={{ border: '2px solid rgba(249,115,22,0.2)' }}>
            <div className="flex items-center gap-2 mb-6">
              <Brain size={24} style={{ color: '#F97316' }} />
              <h2 className="text-xl font-bold" style={{ color: '#1E3A5F', margin: 0 }}>
                Deploy Volunteers
              </h2>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: '#1E3A5F' }}>
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">1</span>
                  Select Target Zone
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="select-field w-full"
                >
                  {DEMO_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.zone_name} ({z.zone_code}) — {z.risk_level.toUpperCase()} Risk
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: '#1E3A5F' }}>
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">2</span>
                  Select Required Skill
                </label>
                <select className="select-field w-full">
                  <option value="">Auto-detect from Zone Requirements</option>
                  <option value="medical">Medical / First Aid</option>
                  <option value="crowd_management">Crowd Management</option>
                  <option value="multilingual">Multilingual Support</option>
                </select>
                <p className="text-xs text-slate-500 mt-2 ml-8">
                  Gemini AI will match volunteers based on these skills, language, and workload.
                </p>
              </div>

              {/* Step 3 */}
              <div className="pt-2">
                <button
                  onClick={handleAssign}
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-base shadow-lg shadow-orange-500/20"
                >
                  <Brain size={18} />
                  Generate Smart Assignment
                </button>
              </div>
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
          <div className="card p-5 mt-2">
            <div className="flex items-center gap-2 mb-4">
              <Search size={18} style={{ color: '#64748B' }} />
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#64748B', margin: 0 }}>
                Secondary: Natural Language Search
              </h2>
            </div>

            <div className="relative mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="input-field pr-24 text-base py-3.5"
                placeholder="Ask anything about volunteers..."
              />
              <button
                onClick={() => handleQuery()}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-xs"
              >
                <Send size={14} />
                Search
              </button>
            </div>

            {/* Example queries */}
            <div className="flex flex-col gap-1.5 mb-3">
              <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>
                Try these:
              </p>
              {EXAMPLE_QUERIES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setQuery(ex); handleQuery(ex); }}
                  className="text-left text-xs py-1.5 px-3 rounded-lg transition-all"
                  style={{
                    background: 'rgba(30,58,95,0.05)',
                    color: '#475569',
                    border: '1px solid rgba(30,58,95,0.08)',
                  }}
                >
                  → {ex}
                </button>
              ))}
            </div>

            {/* Query History */}
            {queryHistory.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#94A3B8' }}>
                  <Clock size={12} />
                  Recent Searches
                </p>
                {queryHistory.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(q); handleQuery(q); }}
                    className="flex items-center gap-2 text-xs py-1 hover:text-saffron-600 w-full text-left"
                    style={{ color: '#64748B' }}
                  >
                    <Search size={11} />
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          </ScrollReveal>
        </div>

        {/* RIGHT — AI Response Display */}
        <ScrollReveal delay={400} className="h-full">
        <div className="card p-5 min-h-[500px] flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain size={18} style={{ color: '#F97316' }} />
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                AI Response
              </h2>
              {mode !== 'idle' && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}
                >
                  {mode === 'balance' ? 'Workload Analysis' : mode === 'query' ? 'Search' : 'Assignment'}
                </span>
              )}
            </div>
            {(balanceData || queryData || assignData || error) && (
              <button onClick={clearResults}>
                <X size={18} style={{ color: '#94A3B8' }} />
              </button>
            )}
          </div>

          {/* Idle state */}
          {mode === 'idle' && !loading && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}
              >
                <Brain size={36} style={{ color: '#F97316', opacity: 0.6 }} />
              </div>
              <div>
                <p className="font-bold" style={{ color: '#1E3A5F' }}>
                  Ready to analyze
                </p>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                  Use an action card or type a search query to activate Gemini AI
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <Zap size={12} style={{ color: '#F97316' }} />
                <span className="text-xs font-medium" style={{ color: '#F97316' }}>
                  Google Gemini 3.5 Flash
                </span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <AIThinking
                message={
                  mode === 'query'
                    ? `Searching: "${query}"`
                    : mode === 'assign'
                    ? 'Finding best volunteers for zone...'
                    : 'Analyzing workforce health...'
                }
                subtext="Processing with Google Gemini 3.5 Flash"
              />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <AlertTriangle size={32} style={{ color: '#DC2626' }} />
              <p className="font-semibold" style={{ color: '#DC2626' }}>{error}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>
                Check your GEMINI_API_KEY in .env.local
              </p>
            </div>
          )}

          {/* Balance Results */}
          {balanceData && !loading && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Health Score */}
              <div
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}
              >
                <div className="text-center">
                  <p className="text-5xl font-black" style={{ color: '#16A34A' }}>
                    {balanceData.overall_health_score}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                    Health Score
                  </p>
                </div>
                <div>
                  <span className="badge badge-medium capitalize text-base">
                    {balanceData.health_status}
                  </span>
                  <p className="text-xs mt-2" style={{ color: '#64748B' }}>
                    {balanceData.critical_alerts?.length || 0} critical alerts
                  </p>
                </div>
              </div>

              {/* Burnout Risks */}
              {balanceData.burnout_risks?.map((risk, i) => (
                <div key={i} className="p-3 rounded-xl"
                  style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>{risk.name}</span>
                    <span className="badge badge-critical">{risk.workload_score}%</span>
                  </div>
                  <p className="text-xs" style={{ color: '#DC2626' }}>{risk.recommendation}</p>
                </div>
              ))}

              {/* Rebalancing */}
              {balanceData.rebalancing_suggestions?.map((s, i) => (
                <div key={i} className="p-3 rounded-xl"
                  style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <p className="text-sm font-semibold" style={{ color: '#EA580C' }}>{s.action}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{s.reason}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: '#16A34A' }}>↗ {s.impact}</p>
                </div>
              ))}

              {/* Skill Gaps */}
              {balanceData.skill_gap_analysis && Object.keys(balanceData.skill_gap_analysis).length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <p className="text-sm font-bold mb-2" style={{ color: '#1E3A5F' }}>Skill Gap Analysis</p>
                  {Object.entries(balanceData.skill_gap_analysis).map(([skill, note]) => (
                    <div key={skill} className="flex items-start gap-2 mb-1.5">
                      <span className="skill-pill capitalize">{skill.replace('_', ' ')}</span>
                      <span className="text-xs" style={{ color: '#64748B' }}>{note}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn-primary w-full">
                <CheckCircle size={16} />
                Apply All Recommendations
              </button>
            </div>
          )}

          {/* Query Results */}
          {queryData && !loading && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Search interpretation */}
              <div
                className="p-4 rounded-xl"
                style={{ background: 'rgba(30,58,95,0.06)', border: '1px solid rgba(30,58,95,0.12)' }}
              >
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
                  SEARCH INTERPRETED AS
                </p>
                <p className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
                  {queryData.search_interpretation}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {queryData.filters_applied?.skills?.map((s) => (
                    <span key={s} className="skill-pill">{s}</span>
                  ))}
                  {queryData.filters_applied?.languages?.map((l) => (
                    <span key={l} className="lang-pill">{l}</span>
                  ))}
                  {queryData.filters_applied?.availability && (
                    <span className="badge badge-available">{queryData.filters_applied.availability}</span>
                  )}
                </div>
              </div>

              <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>
                {queryData.result_summary}
              </p>

              {matchedVolunteers.map((v) => (
                <div key={v.id} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                  >
                    {v.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{v.name}</p>
                      <BharatScoreGauge score={v.bharat_ready_score} size="sm" showLabel={false} />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {v.skills.slice(0, 4).map((s) => <span key={s} className="skill-pill">{s.replace('_', ' ')}</span>)}
                    </div>
                    <WorkloadBar score={v.workload_score} compact />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assignment Results */}
          {assignData && !loading && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Confidence */}
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#94A3B8' }}>CONFIDENCE SCORE</p>
                  <p className="text-3xl font-black" style={{ color: '#16A34A' }}>
                    {Math.round((assignData.confidence_score || 0) * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Shift: {assignData.shift_recommendation}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: '#475569' }}>
                    {assignData.coverage_summary}
                  </p>
                </div>
              </div>

              {/* Warnings */}
              {assignData.warnings?.map((w, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <AlertTriangle size={13} style={{ color: '#D97706', marginTop: 1 }} />
                  <p className="text-xs" style={{ color: '#D97706' }}>{w}</p>
                </div>
              ))}

              {/* Selected volunteers */}
              {assignData.selected_volunteer_ids?.map((id) => {
                const vol = DEMO_VOLUNTEERS.find((v) => v.id === id);
                if (!vol) return null;
                const reason = assignData.assignment_reasoning?.[id];
                return (
                  <div key={id} className="p-3 rounded-xl"
                    style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5A8E)' }}
                      >
                        {vol.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{vol.name}</p>
                        <WorkloadBar score={vol.workload_score} showLabel={false} compact />
                      </div>
                      <BharatScoreGauge score={vol.bharat_ready_score} size="sm" showLabel={false} />
                    </div>
                    {reason && (
                      <p className="text-xs" style={{ color: '#64748B' }}>
                        {reason}
                      </p>
                    )}
                  </div>
                );
              })}

              <button className="btn-primary w-full">
                <CheckCircle size={16} />
                Apply Assignments
              </button>
            </div>
          )}
        </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
