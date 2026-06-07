'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'saffron' | 'navy' | 'gold' | 'green' | 'red' | 'amber';
  animate?: boolean;
  suffix?: string;
  prefix?: string;
}

const colorMap = {
  saffron: { bg: 'rgba(249,115,22,0.1)', icon: '#F97316', text: '#EA580C' },
  navy: { bg: 'rgba(30,58,95,0.1)', icon: '#1E3A5F', text: '#1E3A5F' },
  gold: { bg: 'rgba(245,158,11,0.1)', icon: '#F59E0B', text: '#D97706' },
  green: { bg: 'rgba(22,163,74,0.1)', icon: '#16A34A', text: '#16A34A' },
  red: { bg: 'rgba(220,38,38,0.1)', icon: '#DC2626', text: '#DC2626' },
  amber: { bg: 'rgba(217,119,6,0.1)', icon: '#D97706', text: '#D97706' },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  color = 'navy',
  animate = true,
  suffix = '',
  prefix = '',
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;
  const colors = colorMap[color];

  useEffect(() => {
    if (!animate || typeof value !== 'number') return;
    const duration = 1000;
    const steps = 50;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, animate, numericValue]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? '#16A34A' : trend === 'down' ? '#DC2626' : '#94A3B8';

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="label">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-lg font-semibold" style={{ color: colors.text }}>{prefix}</span>}
            <span
              className="text-3xl font-black number-reveal"
              style={{ color: colors.text }}
            >
              {typeof value === 'number'
                ? animate
                  ? displayValue.toLocaleString()
                  : numericValue.toLocaleString()
                : value}
            </span>
            {suffix && <span className="text-lg font-semibold" style={{ color: colors.text }}>{suffix}</span>}
          </div>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: colors.bg }}
        >
          <Icon size={22} style={{ color: colors.icon }} />
        </div>
      </div>
      {trendValue && (
        <div className="flex items-center gap-1.5">
          <TrendIcon size={14} style={{ color: trendColor }} />
          <span className="text-xs font-medium" style={{ color: trendColor }}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
