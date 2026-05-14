import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  const trendColors = {
    up: 'text-[var(--severity-critical)]',
    down: 'text-[var(--severity-low)]',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className="border-2 border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">{label}</div>
          <div
            className={`text-2xl ${trend ? trendColors[trend] : ''}`}
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
          >
            {value}
          </div>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </div>
  );
}

interface StatsSummaryProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
