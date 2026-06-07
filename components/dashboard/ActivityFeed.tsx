'use client';

import { ActivityFeedItem } from '@/types';
import { 
  AlertTriangle, Brain, UserCheck, LogIn, LogOut, Bell, Clock 
} from 'lucide-react';

interface ActivityFeedProps {
  items: ActivityFeedItem[];
  dark?: boolean;
}

const typeConfig = {
  incident: { icon: AlertTriangle, color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  ai: { icon: Brain, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  assignment: { icon: UserCheck, color: '#1E3A5F', bg: 'rgba(30,58,95,0.1)' },
  checkin: { icon: LogIn, color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
  checkout: { icon: LogOut, color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  alert: { icon: Bell, color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function ActivityFeed({ items, dark = false }: ActivityFeedProps) {
  const textColor = dark ? 'rgba(255,255,255,0.9)' : '#1E3A5F';
  const subColor = dark ? 'rgba(255,255,255,0.5)' : '#64748B';
  const hoverBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(249,115,22,0.03)';

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {items.map((item, idx) => {
        const config = typeConfig[item.type] || typeConfig.alert;
        const Icon = config.icon;

        return (
          <div
            key={item.id}
            className="activity-item"
            style={{
              animationDelay: `${idx * 0.05}s`,
              '--hover-bg': hoverBg,
            } as React.CSSProperties}
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
              style={{ background: config.bg }}
            >
              <Icon size={16} style={{ color: config.color }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: textColor }}
                >
                  {item.title}
                </p>
                <span
                  className="flex items-center gap-1 text-xs flex-shrink-0"
                  style={{ color: subColor }}
                >
                  <Clock size={10} />
                  {timeAgo(item.timestamp)}
                </span>
              </div>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: subColor }}>
                {item.description}
              </p>
              {item.zone && (
                <span
                  className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(30,58,95,0.08)',
                    color: '#1E3A5F',
                  }}
                >
                  {item.zone}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
