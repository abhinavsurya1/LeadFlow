import axios from 'axios';
import { Lead, Discussion, CreateLeadDto, UpdateLeadDto, CreateDiscussionDto } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

export const leadsApi = {
  list: async (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);
    
    const { data } = await api.get<Lead[]>(`/leads?${params.toString()}`);
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  },
  
  create: async (payload: CreateLeadDto) => {
    const { data } = await api.post<Lead>('/leads', payload);
    return data;
  },
  
  update: async (id: string, payload: UpdateLeadDto) => {
    const { data } = await api.patch<Lead>(`/leads/${id}`, payload);
    return data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/leads/${id}`);
  }
};

export const discussionsApi = {
  listByLead: async (leadId: string) => {
    const { data } = await api.get<Discussion[]>(`/leads/${leadId}/discussions`);
    return data;
  },
  
  create: async (leadId: string, payload: CreateDiscussionDto) => {
    const { data } = await api.post<Discussion>(`/leads/${leadId}/discussions`, payload);
    return data;
  }
};
