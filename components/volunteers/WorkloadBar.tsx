'use client';

import { getWorkloadColor, getWorkloadLabel } from '@/lib/demo-data';
import { AlertTriangle } from 'lucide-react';

interface WorkloadBarProps {
  score: number;
  showLabel?: boolean;
  showValue?: boolean;
  compact?: boolean;
}

export default function WorkloadBar({
  score,
  showLabel = true,
  showValue = true,
  compact = false,
}: WorkloadBarProps) {
  const color = getWorkloadColor(score);
  const label = getWorkloadLabel(score);
  const isBurnout = score > 85;
  const isCaution = score > 70;

  return (
    <div className={`flex flex-col gap-1 ${compact ? '' : 'w-full'}`}>
      {(showLabel || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {showLabel && (
            <span
              className={`text-xs font-semibold flex items-center gap-1 ${isBurnout ? 'burnout-pulse' : ''}`}
              style={{ color }}
            >
              {isBurnout && <AlertTriangle size={11} />}
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs font-bold" style={{ color }}>
              {score}%
            </span>
          )}
        </div>
      )}
      <div className="workload-bar" style={{ width: compact ? '80px' : '100%' }}>
        <div
          className="workload-bar-fill"
          style={{
            width: `${score}%`,
            background: isBurnout
              ? `linear-gradient(90deg, ${color}, #991B1B)`
              : color,
          }}
        />
      </div>
    </div>
  );
}
