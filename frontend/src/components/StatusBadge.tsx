import { LeadStatus } from '../types';
import { cn } from '../lib/utils';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<LeadStatus, string> = {
    New: 'bg-blue-100 text-blue-800 border-blue-200',
    Contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Qualified: 'bg-purple-100 text-purple-800 border-purple-200',
    ProposalSent: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Won: 'bg-green-100 text-green-800 border-green-200',
    Lost: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight transition-colors duration-150 ease-out-soft',
        styles[status],
        className
      )}
    >
      {status.replace(/([A-Z])/g, ' $1').trim()}
    </span>
  );
}
