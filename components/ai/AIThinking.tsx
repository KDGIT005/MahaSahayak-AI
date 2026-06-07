'use client';

import { Brain, Zap } from 'lucide-react';

interface AIThinkingProps {
  message?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

export default function AIThinking({
  message = 'AI Analyzing...',
  subtext = 'Evaluating volunteer profiles and zone requirements',
  size = 'md',
  dark = false,
}: AIThinkingProps) {
  const textColor = dark ? 'rgba(255,255,255,0.9)' : '#1E3A5F';
  const subColor = dark ? 'rgba(255,255,255,0.5)' : '#94A3B8';
  const iconSize = size === 'lg' ? 40 : size === 'md' ? 28 : 20;
  const padding = size === 'lg' ? 'p-10' : size === 'md' ? 'p-8' : 'p-5';

  return (
    <div className={`flex flex-col items-center justify-center ${padding} gap-5`}>
      {/* Brain icon with orbit */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(249,115,22,0.15)',
            animation: 'pulse-gold 1.5s ease-in-out infinite',
            width: iconSize + 24,
            height: iconSize + 24,
            top: -12,
            left: -12,
          }}
        />
        <Brain
          size={iconSize}
          style={{ color: '#F97316', position: 'relative', zIndex: 1 }}
        />
        <div
          className="absolute -top-1 -right-1"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#F59E0B',
            animation: 'ai-pulse 1.2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="font-bold text-base" style={{ color: textColor }}>
          {message}
        </p>
        <p className="text-sm mt-1" style={{ color: subColor }}>
          {subtext}
        </p>
      </div>

      {/* Wave bars animation */}
      <div className="flex items-end gap-1 h-8">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="ai-wave-bar"
            style={{
              background: i % 2 === 0 ? '#F97316' : '#F59E0B',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="ai-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
        <Zap size={12} style={{ color: '#F97316' }} />
        <span className="text-xs font-medium" style={{ color: '#F97316' }}>
          Powered by Google Gemini
        </span>
      </div>
    </div>
  );
}
