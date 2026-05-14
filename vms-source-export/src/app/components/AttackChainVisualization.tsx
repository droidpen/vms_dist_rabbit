import { ArrowRight, Target, Shield } from 'lucide-react';
import { mapCVEToTTPs } from '../../lib/cveToTTPMapping';

interface AttackChainVisualizationProps {
  cveId: string;
}

export function AttackChainVisualization({ cveId }: AttackChainVisualizationProps) {
  const mapping = mapCVEToTTPs(cveId);

  if (!mapping) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* CVE-Specific TTPs */}
      <div className="border-2 border-orange-300 bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-orange-700" strokeWidth={2} />
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }} className="text-orange-900">
            CVE-Specific Attack Techniques ({mapping.cveId})
          </h4>
        </div>

        <div className="space-y-3">
          {mapping.primaryTechniques.map((technique, idx) => (
            <div key={idx} className="bg-white border-2 border-orange-200 rounded p-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center border-2 border-orange-400 bg-orange-100 text-orange-700 rounded-full flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600 }} className="text-orange-900">
                      {technique.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-orange-200 text-orange-800 rounded" style={{ fontFamily: 'var(--font-mono)' }}>
                      {technique.tactic}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600 }} className="text-orange-900 mb-2">
                    {technique.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} className="text-orange-700">
                    {technique.reasoning}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Chain */}
      {mapping.attackChain.length > 0 && (
        <div className="border-2 border-red-300 bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-700" strokeWidth={2} />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }} className="text-red-900">
              Attack Chain Progression
            </h4>
          </div>

          <div className="space-y-2">
            {mapping.attackChain.map((step, idx) => (
              <div key={idx}>
                <div className="flex items-start gap-3 bg-white border-2 border-red-200 rounded p-3">
                  <div className="w-8 h-8 flex items-center justify-center border-2 border-red-400 bg-red-100 text-red-700 rounded-full flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700 }}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }} className="text-red-900">
                        {step.technique}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }} className="text-red-700">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Arrow between steps */}
                {idx < mapping.attackChain.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="w-5 h-5 text-red-400" strokeWidth={2} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Exploit Path Summary */}
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
            <div className="text-xs font-semibold text-red-800 mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
              FULL EXPLOIT PATH:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} className="text-red-900">
              {mapping.exploitPath}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
