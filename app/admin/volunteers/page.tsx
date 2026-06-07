'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Users, Brain, Download, X, CheckCircle2 } from 'lucide-react';
import BharatScoreGauge from '@/components/volunteers/BharatScoreGauge';
import WorkloadBar from '@/components/volunteers/WorkloadBar';
import AIThinking from '@/components/ai/AIThinking';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { DEMO_VOLUNTEERS } from '@/lib/demo-data';
import { Volunteer } from '@/types';

const SKILLS = ['medical', 'first_aid', 'crowd_management', 'traffic_coordination', 'information_desk', 'multilingual', 'emergency_response', 'cpr', 'security', 'food_distribution'];
const AVAILABILITIES = ['available', 'busy', 'on_break', 'offline'];
const EXPERIENCE = ['beginner', 'intermediate', 'expert'];

export default function VolunteersPage() {
  const [search, setSearch] = useState('');
  const [filterAvail, setFilterAvail] = useState('');
  const [filterExp, setFilterExp] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isOptimizing) {
      const timer = setTimeout(() => {
        setIsOptimizing(false);
        setShowResult(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOptimizing]);

  const filtered = DEMO_VOLUNTEERS.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.skills.some((s) => s.includes(search.toLowerCase()));
    const matchAvail = !filterAvail || v.availability === filterAvail;
    const matchExp = !filterExp || v.experience_level === filterExp;
    const matchSkill = !filterSkill || v.skills.includes(filterSkill);
    return matchSearch && matchAvail && matchExp && matchSkill;
  });

  const availCounts = {
    available: DEMO_VOLUNTEERS.filter(v => v.availability === 'available').length,
    busy: DEMO_VOLUNTEERS.filter(v => v.availability === 'busy').length,
    on_break: DEMO_VOLUNTEERS.filter(v => v.availability === 'on_break').length,
    offline: DEMO_VOLUNTEERS.filter(v => v.availability === 'offline').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>Volunteer Directory</h1>
          <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
            {DEMO_VOLUNTEERS.length} registered · {availCounts.available} available now
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost flex items-center gap-2 text-sm">
            <Download size={15} /> Export CSV
          </button>
          <button 
            className="btn-primary flex items-center gap-2 text-sm"
            onClick={() => setIsOptimizing(true)}
            disabled={isOptimizing || showResult}
          >
            <Brain size={15} /> AI Optimize
          </button>
        </div>
      </div>

      {/* Status summary */}
      <ScrollReveal delay={0}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {Object.entries(availCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterAvail(filterAvail === status ? '' : status)}
            className="card p-4 text-center cursor-pointer"
            style={{
              border: filterAvail === status ? `2px solid var(--saffron)` : undefined,
              background: filterAvail === status ? 'rgba(249,115,22,0.04)' : undefined,
            }}
          >
            <p className="text-2xl font-black" style={{ color: '#1E3A5F' }}>{count}</p>
            <p className="text-xs capitalize mt-1" style={{ color: '#94A3B8' }}>
              {status.replace('_', ' ')}
            </p>
            <div
              className="w-2 h-2 rounded-full mx-auto mt-1.5"
              style={{
                background: status === 'available' ? '#16A34A'
                  : status === 'busy' ? '#EA580C'
                  : status === 'on_break' ? '#D97706' : '#6B7280'
              }}
            />
          </button>
        ))}
      </div>
      </ScrollReveal>

      {/* Filters */}
      <ScrollReveal delay={100}>
      <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)} className="select-field w-40">
          <option value="">All Status</option>
          {AVAILABILITIES.map(a => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
        </select>
        <select value={filterExp} onChange={(e) => setFilterExp(e.target.value)} className="select-field w-36">
          <option value="">All Levels</option>
          {EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} className="select-field w-44">
          <option value="">All Skills</option>
          {SKILLS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <span className="text-sm font-medium" style={{ color: '#94A3B8' }}>
          {filtered.length} results
        </span>
      </div>
      </ScrollReveal>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v, index) => (
          <ScrollReveal key={v.id} delay={(index % 10) * 50}>
          <div className="card p-5 hover:shadow-lg transition-shadow border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner"
                  style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                >
                  {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: '#1E3A5F' }}>{v.name}</p>
                  <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Age {v.age} • <span className="capitalize">{v.experience_level}</span></p>
                </div>
              </div>
              <span className={`badge badge-${
                v.availability === 'available' ? 'available'
                : v.availability === 'busy' ? 'busy'
                : v.availability === 'on_break' ? 'break'
                : 'offline'
              } capitalize`}>
                {v.availability.replace('_', ' ')}
              </span>
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {v.skills.slice(0, 4).map(s => (
                <span key={s} className="skill-pill bg-slate-50 border-slate-200 text-xs px-2 py-1 rounded-md">{s.replace('_', ' ')}</span>
              ))}
              {v.skills.length > 4 && (
                <span className="skill-pill bg-slate-50 border-slate-200 text-xs px-2 py-1 rounded-md">+{v.skills.length - 4}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Workload</p>
                <WorkloadBar score={v.workload_score} compact={false} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bharat Ready</p>
                <BharatScoreGauge score={v.bharat_ready_score} size="sm" showLabel={false} />
              </div>
            </div>
          </div>
          </ScrollReveal>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No volunteers found matching your filters.
          </div>
        )}
      </div>

      {/* AI Optimization Modal */}
      {(isOptimizing || showResult) && (
        <div className="modal-overlay">
          <div className="modal-content text-center">
            {isOptimizing ? (
              <AIThinking 
                message="Gemini AI Analyzing..." 
                subtext="Evaluating workload, skills, and zone coverage for optimal deployment" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(22,163,74,0.1)' }}>
                  <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
                </div>
                <h2 className="text-2xl font-black" style={{ color: '#1E3A5F' }}>Optimization Complete</h2>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Gemini AI successfully optimized the volunteer deployment strategy.
                </p>
                <div className="w-full text-left bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
                    <span className="text-sm font-medium text-slate-700">Reassigned 4 volunteers from Zone 1 to Zone 3 to balance high traffic.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
                    <span className="text-sm font-medium text-slate-700">Recommended 3 medical experts take a break to prevent burnout.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
                    <span className="text-sm font-medium text-slate-700">Identified 2 multilingual volunteers for upcoming VIP delegation.</span>
                  </div>
                </div>
                <button 
                  className="btn-primary w-full max-w-xs"
                  onClick={() => setShowResult(false)}
                >
                  Apply Recommendations
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
