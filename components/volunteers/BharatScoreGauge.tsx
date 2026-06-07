'use client';

import { useEffect, useState } from 'react';
import { getBRSColor, getBRSLabel } from '@/lib/demo-data';

interface BharatScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function BharatScoreGauge({
  score,
  size = 'md',
  showLabel = true,
}: BharatScoreGaugeProps) {
  const [animated, setAnimated] = useState(false);

  const dimensions = {
    sm: { svgSize: 64, r: 24, stroke: 5, fontSize: 14, labelSize: 9 },
    md: { svgSize: 96, r: 38, stroke: 7, fontSize: 20, labelSize: 11 },
    lg: { svgSize: 140, r: 56, stroke: 10, fontSize: 30, labelSize: 13 },
  };

  const { svgSize, r, stroke, fontSize, labelSize } = dimensions[size];
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animated ? score / 100 : 0) * circumference;
  const color = getBRSColor(score);
  const label = getBRSLabel(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="brs-gauge"
        style={{ filter: `drop-shadow(0 2px 8px ${color}40)` }}
      >
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={stroke}
        />
        {/* Progress ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="700"
          fill={color}
          fontFamily="Inter, sans-serif"
        >
          {score}
        </text>
        {size === 'lg' && (
          <text
            x={cx}
            y={cy + fontSize / 1.2}
            textAnchor="middle"
            fontSize={labelSize}
            fill="#94A3B8"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
          >
            / 100
          </text>
        )}
      </svg>
      {showLabel && (
        <span
          className="font-semibold text-center"
          style={{ fontSize: labelSize, color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
