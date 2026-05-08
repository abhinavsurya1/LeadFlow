import { create } from 'zustand';

interface AppState {
  selectedLeadId: string | null;
  searchQuery: string;
  statusFilter: string;
  setSelectedLeadId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedLeadId: null,
  searchQuery: '',
  statusFilter: 'All',
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
