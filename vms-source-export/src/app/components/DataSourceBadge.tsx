import { Database, Globe, FileText, CheckCircle2 } from 'lucide-react';

interface DataSourceBadgeProps {
  source: 'nvd' | 'epss' | 'kev' | 'manual' | 'demo';
  label?: string;
  showIcon?: boolean;
}

export function DataSourceBadge({ source, label, showIcon = true }: DataSourceBadgeProps) {
  const configs = {
    nvd: {
      icon: Database,
      text: label || 'NVD',
      title: 'National Vulnerability Database - Real CVE data from NIST',
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    epss: {
      icon: Globe,
      text: label || 'EPSS',
      title: 'Exploit Prediction Scoring System - Real exploitation probability data from FIRST',
      bg: 'bg-green-100',
      border: 'border-green-300',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    kev: {
      icon: CheckCircle2,
      text: label || 'CISA KEV',
      title: 'CISA Known Exploited Vulnerabilities - Confirmed active exploitation',
      bg: 'bg-red-100',
      border: 'border-red-300',
      textColor: 'text-red-700',
      iconColor: 'text-red-600'
    },
    manual: {
      icon: FileText,
      text: label || 'Manual',
      title: 'Manually entered from uploaded documents',
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-600'
    },
    demo: {
      icon: FileText,
      text: label || 'Demo',
      title: 'Demo data - Not from external sources',
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600'
    }
  };

  const config = configs[source];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 border ${config.border} ${config.bg} rounded`}
      title={config.title}
    >
      {showIcon && <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} strokeWidth={2} />}
      <span
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600 }}
        className={config.textColor}
      >
        {config.text}
      </span>
    </div>
  );
}
