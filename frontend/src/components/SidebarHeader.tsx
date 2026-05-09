import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LeadStatus } from '../types';

export function SidebarHeader() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const statusFilter = useStore((state) => state.statusFilter);
  const setStatusFilter = useStore((state) => state.setStatusFilter);

  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateFilterScrollArrows = useCallback(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const canScroll = scrollWidth > clientWidth + 1;
    if (!canScroll) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }
    setShowLeftArrow(scrollLeft > 4);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateFilterScrollArrows();
    const el = filterScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateFilterScrollArrows());
    ro.observe(el);
    el.addEventListener('scroll', updateFilterScrollArrows, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', updateFilterScrollArrows);
    };
  }, [updateFilterScrollArrows]);

  const scrollFilters = (dir: 'left' | 'right') => {
    const el = filterScrollRef.current;
    if (!el) return;
    const amount = Math.min(160, el.clientWidth * 0.6);
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const statuses: (LeadStatus | 'All')[] = ['All', 'New', 'Contacted', 'Qualified', 'ProposalSent', 'Won', 'Lost'];

  return (
    <div className="border-b border-gray-200/90 bg-white p-4">
      <div className="relative mb-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-200 bg-gray-50/90 py-2 pl-10 pr-3 text-sm leading-5 text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow,background-color] duration-200 ease-out-soft focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Search by name or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="relative">
        {showLeftArrow && (
          <button
            type="button"
            aria-label="Scroll filters left"
            onClick={() => scrollFilters('left')}
            className="absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-gray-700 shadow-[0_1px_3px_rgba(15,23,42,0.1)] ring-1 ring-black/[0.04] transition-[color,box-shadow,background-color] duration-150 hover:border-gray-300 hover:bg-white hover:text-gray-900 hover:shadow-md"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
        {showRightArrow && (
          <button
            type="button"
            aria-label="Scroll filters right"
            onClick={() => scrollFilters('right')}
            className="absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-gray-700 shadow-[0_1px_3px_rgba(15,23,42,0.1)] ring-1 ring-black/[0.04] transition-[color,box-shadow,background-color] duration-150 hover:border-gray-300 hover:bg-white hover:text-gray-900 hover:shadow-md"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
        <div
          ref={filterScrollRef}
          className={`flex gap-2 overflow-x-auto pb-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${showLeftArrow ? 'pl-8' : ''} ${showRightArrow ? 'pr-8' : ''}`}
        >
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`tap-scale min-h-[32px] shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out-soft ${
                statusFilter === status
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
