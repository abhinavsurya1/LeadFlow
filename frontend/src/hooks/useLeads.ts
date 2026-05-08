import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../lib/api';
import { CreateLeadDto, UpdateLeadDto } from '../types';

export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (status: string, search: string) => [...leadKeys.lists(), { status, search }] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
};

export const useLeads = (status: string, search: string) => {
  return useQuery({
    queryKey: leadKeys.list(status, search),
    queryFn: () => leadsApi.list(status, search),
  });
};

export const useLead = (id: string | null) => {
  return useQuery({
    queryKey: leadKeys.detail(id!),
    queryFn: () => leadsApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadDto) => leadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) => leadsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(data.id) });
    },
  });
};
