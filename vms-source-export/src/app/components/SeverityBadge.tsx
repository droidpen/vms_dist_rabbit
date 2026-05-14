interface SeverityBadgeProps {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const styles = {
    CRITICAL: 'bg-[var(--severity-critical-bg)] text-[var(--severity-critical)] border-[var(--severity-critical-border)]',
    HIGH: 'bg-[var(--severity-high-bg)] text-[var(--severity-high)] border-[var(--severity-high-border)]',
    MEDIUM: 'bg-[var(--severity-medium-bg)] text-[var(--severity-medium)] border-[var(--severity-medium-border)]',
    LOW: 'bg-[var(--severity-low-bg)] text-[var(--severity-low)] border-[var(--severity-low-border)]',
    INFO: 'bg-[var(--severity-info-bg)] text-[var(--severity-info)] border-[var(--severity-info-border)]',
  };

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-block border-2 ${styles[severity]} ${sizeClass}`}
      style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
    >
      {severity}
    </span>
  );
}
