'use client';

import { Zone } from '@/types';
import { getRiskColor } from '@/lib/demo-data';
import { Users, AlertTriangle, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ZoneCardProps {
  zone: Zone;
  compact?: boolean;
  onClick?: () => void;
}

const riskLabels: Record<string, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

const densityLabel: Record<string, string> = {
  extreme: 'Extreme',
  very_high: 'Very High',
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
};

export default function ZoneCard({ zone, compact = false, onClick }: ZoneCardProps) {
  const router = useRouter();
  const coverage = Math.round(
    (zone.current_volunteer_count / zone.required_volunteer_count) * 100
  );
  const riskColor = getRiskColor(zone.risk_level);
  const isCritical = zone.risk_level === 'critical';
  const isHigh = zone.risk_level === 'high';
  const isUnderstaffed = coverage < 60;

  const handleClick = () => {
    if (onClick) onClick();
    else router.push(`/admin/zones`);
  };

  return (
    <div
      className={`card p-4 cursor-pointer relative overflow-hidden ${
        isCritical ? 'zone-critical' : isHigh ? 'zone-high' : ''
      }`}
      onClick={handleClick}
      style={{
        borderColor: isCritical
          ? 'rgba(220,38,38,0.4)'
          : isHigh
          ? 'rgba(234,88,12,0.3)'
          : undefined,
        background: isCritical
          ? 'linear-gradient(135deg, rgba(220,38,38,0.04), white)'
          : isHigh
          ? 'linear-gradient(135deg, rgba(234,88,12,0.04), white)'
          : undefined,
      }}
    >
      {/* Risk indicator stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: riskColor }}
      />

      <div className="flex items-start justify-between mb-3 pt-1">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {zone.zone_code}
          </span>
          <h3 className="font-bold text-sm mt-0.5" style={{ color: '#1E3A5F' }}>
            {zone.zone_name}
          </h3>
        </div>
        <span
          className={`badge badge-${zone.risk_level} flex items-center gap-1`}
        >
          {isCritical && <AlertTriangle size={10} />}
          {riskLabels[zone.risk_level]}
        </span>
      </div>

      {/* Volunteer count */}
      <div className="flex items-center gap-2 mb-2">
        <Users size={13} style={{ color: riskColor }} />
        <span className="text-sm font-bold" style={{ color: '#1E3A5F' }}>
          {zone.current_volunteer_count}
          <span className="text-gray-400 font-normal">/{zone.required_volunteer_count}</span>
        </span>
        <span className="text-xs text-gray-400">volunteers</span>
      </div>

      {/* Coverage bar */}
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">Coverage</span>
          <span
            className="text-xs font-bold"
            style={{ color: isUnderstaffed ? '#DC2626' : coverage >= 80 ? '#16A34A' : '#D97706' }}
          >
            {coverage}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(coverage, 100)}%`,
              background:
                coverage < 60
                  ? '#DC2626'
                  : coverage < 80
                  ? '#D97706'
                  : '#16A34A',
            }}
          />
        </div>
      </div>

      {!compact && (
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={11} className="text-gray-400" />
          <span className="text-xs text-gray-400">
            Density: {densityLabel[zone.crowd_density]}
          </span>
        </div>
      )}
    </div>
  );
}
