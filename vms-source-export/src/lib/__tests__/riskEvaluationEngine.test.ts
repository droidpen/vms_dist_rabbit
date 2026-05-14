import { describe, it, expect } from 'vitest';
import { calculateAdjustedSeverity } from '../riskEvaluationEngine';

describe('Risk Evaluation Engine - Severity Calculation', () => {
  it('should return CRITICAL for high scores', () => {
    // avgScore = (9 * 0.7) + (30 / 10 * 0.3) = 6.3 + 0.9 = 7.2. Wait, need higher.
    // Let's test the logic: environmental 10 (7), threat 100 (3) -> 7+3 = 10
    const result = calculateAdjustedSeverity('CRITICAL', 10, 100);
    expect(result).toBe('CRITICAL');
  });

  it('should return LOW for low scores', () => {
    const result = calculateAdjustedSeverity('LOW', 1, 10);
    expect(result).toBe('LOW');
  });
});
