import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Analyzing...' }: LoadingStateProps) {
  return (
    <div className="border-2 border-border bg-card p-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
