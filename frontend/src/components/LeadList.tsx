import { useLeads } from '../hooks/useLeads';
import { useStore } from '../store/useStore';
import { useDebounce } from '../hooks/useDebounce';
import { LeadCard } from './LeadCard';
import { isToday } from 'date-fns';
import { Lead } from '../types';

function LeadRowSkeleton() {
  return (
    <div className="animate-pulse border-b border-gray-100/80 p-4">
      <div className="mb-2 flex justify-between gap-3">
        <div className="h-4 w-[45%] max-w-[140px] rounded-md bg-gray-200/90" />
        <div className="h-5 w-16 shrink-0 rounded-full bg-gray-200/80" />
      </div>
      <div className="mt-2 h-3 w-full rounded bg-gray-100" />
      <div className="mt-1.5 h-3 w-4/5 rounded bg-gray-100/90" />
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-24 rounded bg-gray-100" />
        <div className="h-3 w-16 rounded bg-gray-100/80" />
      </div>
    </div>
  );
}

export function LeadList() {
  const searchQuery = useStore((state) => state.searchQuery);
  const statusFilter = useStore((state) => state.statusFilter);
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { data: leads, isLoading, error } = useLeads(statusFilter, debouncedSearch);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden bg-white">
        <div className="border-b border-gray-100 bg-gray-50/90 px-4 py-2">
          <div className="h-3 w-28 animate-pulse rounded bg-gray-200/80" />
        </div>
        <LeadRowSkeleton />
        <LeadRowSkeleton />
        <LeadRowSkeleton />
        <LeadRowSkeleton />
        <LeadRowSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-3 mt-3 rounded-lg border border-red-100 bg-red-50/80 px-4 py-3 text-center text-sm text-red-700 shadow-sm">
        Couldn&apos;t load leads. Check that the backend is running.
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-gray-600">No leads match your filters.</p>
        <p className="mt-1 text-xs text-gray-400">Try adjusting search or status.</p>
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
    <div className="flex-1 divide-y divide-gray-100/90 overflow-y-auto overscroll-contain bg-white">
      {pinnedLeads.length > 0 && (
        <div className="relative bg-[#f9fafb]">
          <div className="sticky top-0 z-10 border-b border-gray-200/60 bg-[#f9fafb]/95 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm">
            📌 Today&apos;s Follow-ups
          </div>
          {pinnedLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      {otherLeads.length > 0 && (
        <div className="relative bg-white">
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 shadow-[0_1px_0_rgba(15,23,42,0.03)] backdrop-blur-sm">
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
