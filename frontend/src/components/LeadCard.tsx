import React from 'react';
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
  
  const getFollowUpColor = () => {
    if (!lead.followUpAt) return 'text-gray-400';
    const date = new Date(lead.followUpAt);
    if (isToday(date)) return 'text-green-600 font-semibold';
    if (isPast(date)) return 'text-red-600 font-semibold';
    return 'text-gray-500';
  };

  return (
    <div
      onClick={() => setSelectedLeadId(lead.id)}
      className={cn(
        'p-4 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50',
        isSelected ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{lead.name}</h3>
          {lead.company && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Building2 className="w-3 h-3 mr-1" />
              {lead.company}
            </div>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {lead.lastNote && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
          <span className="text-gray-500 not-italic">Last note: </span>
          <span className="italic">&quot;{lead.lastNote}&quot;</span>
          {lead.lastNoteAt && (
            <span className="text-gray-400 not-italic">
              {' '}
              {formatDistanceToNow(new Date(lead.lastNoteAt), { addSuffix: true })}
            </span>
          )}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 text-xs">
        <div className={cn("flex items-center", getFollowUpColor())}>
          <Clock className="w-3 h-3 mr-1" />
          {lead.followUpAt ? format(new Date(lead.followUpAt), 'MMM d, h:mm a') : 'No follow-up'}
        </div>
        {lead.phone && (
          <div className="flex items-center text-gray-500">
            <Phone className="w-3 h-3 mr-1" />
            {lead.phone}
          </div>
        )}
      </div>
    </div>
  );
}
