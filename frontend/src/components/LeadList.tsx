import React from 'react';
import { useLeads } from '../hooks/useLeads';
import { useStore } from '../store/useStore';
import { useDebounce } from '../hooks/useDebounce';
import { LeadCard } from './LeadCard';
import { Loader2 } from 'lucide-react';
import { isToday } from 'date-fns';
import { Lead } from '../types';

export function LeadList() {
  const searchQuery = useStore((state) => state.searchQuery);
  const statusFilter = useStore((state) => state.statusFilter);
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { data: leads, isLoading, error } = useLeads(statusFilter, debouncedSearch);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading leads...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center bg-red-50 m-4 rounded-md">
        Failed to load leads. Please ensure the backend is running.
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No leads found matching your criteria.
      </div>
    );
  }

  const isTodaysFollowUp = (lead: Lead) => {
    if (!lead.followUpAt) return false;
    return isToday(new Date(lead.followUpAt));
  };

  const pinnedLeads = leads.filter(isTodaysFollowUp);
  const pinnedIds = new Set(pinnedLeads.map((l) => l.id));
  const otherLeads = leads.filter((l) => !pinnedIds.has(l.id));

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
      {pinnedLeads.length > 0 && (
        <div className="bg-gray-50/80 relative">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10 shadow-sm">
            📌 Today&apos;s Follow-ups
          </div>
          {pinnedLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      {otherLeads.length > 0 && (
        <div className="bg-white relative">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
            All Leads
          </div>
          {otherLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
