import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useDebounce } from '../hooks/useDebounce';
import { LeadStatus } from '../types';

export function SidebarHeader() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const statusFilter = useStore((state) => state.statusFilter);
  const setStatusFilter = useStore((state) => state.setStatusFilter);

  const statuses: (LeadStatus | 'All')[] = ['All', 'New', 'Contacted', 'Qualified', 'ProposalSent', 'Won', 'Lost'];

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          placeholder="Search by name or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
