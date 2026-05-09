import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { Clock, Building2, Phone } from 'lucide-react';
import { Lead } from '../types';
import { StatusBadge } from './StatusBadge';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const selectedLeadId = useStore((state) => state.selectedLeadId);
  const setSelectedLeadId = useStore((state) => state.setSelectedLeadId);

  const isSelected = selectedLeadId === lead.id;

  const followDate = lead.followUpAt ? new Date(lead.followUpAt) : null;
  const isDueToday = followDate ? isToday(followDate) : false;
  const isOverdue = followDate ? isPast(followDate) && !isToday(followDate) : false;

  const getFollowUpColor = () => {
    if (!followDate) return 'text-gray-400';
    if (isDueToday) return 'text-amber-700 font-medium';
    if (isOverdue) return 'text-red-600 font-semibold';
    return 'text-gray-500';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedLeadId(lead.id);
        }
      }}
      onClick={() => setSelectedLeadId(lead.id)}
      className={cn(
        'group cursor-pointer border-b border-gray-100/85 px-4 py-3.5 transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out-soft',
        'hover:-translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2',
        isSelected
          ? 'border-l-[3px] border-l-blue-600 bg-blue-50/80 shadow-sm hover:bg-blue-50/90'
          : cn(
              'border-l-[3px] border-l-transparent hover:bg-gray-50/90',
              isOverdue && 'border-l-red-500 bg-red-50/35 hover:bg-red-50/45',
              !isOverdue && isDueToday && 'border-l-amber-400 bg-amber-50/40 hover:bg-amber-50/55'
            )
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-semibold leading-snug tracking-tight text-gray-900">{lead.name}</h3>
          {lead.company && (
            <div className="mt-1 flex items-center text-xs text-gray-500">
              <Building2 className="mr-1 h-3 w-3 shrink-0 text-gray-400" />
              <span className="truncate">{lead.company}</span>
            </div>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {lead.lastNote && (
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-gray-600">
          <span className="font-medium text-gray-500 not-italic">Last note </span>
          <span className="font-normal italic text-gray-600">&quot;{lead.lastNote}&quot;</span>
          {lead.lastNoteAt && (
            <span className="text-gray-400 not-italic">
              {' '}
              · {formatDistanceToNow(new Date(lead.lastNoteAt), { addSuffix: true })}
            </span>
          )}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 text-xs leading-none">
        <div className={cn('flex min-h-[1.25rem] items-center gap-1', getFollowUpColor())}>
          <Clock className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
          {lead.followUpAt ? format(new Date(lead.followUpAt), 'MMM d, h:mm a') : 'No follow-up'}
        </div>
        {lead.phone && (
          <div className="flex items-center tabular-nums text-gray-500">
            <Phone className="mr-1 h-3 w-3 shrink-0 text-gray-400" />
            {lead.phone}
          </div>
        )}
      </div>
    </div>
  );
}
