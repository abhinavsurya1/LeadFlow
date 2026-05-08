import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discussionsApi } from '../lib/api';
import { CreateDiscussionDto } from '../types';
import { leadKeys } from './useLeads';

export const discussionKeys = {
  all: ['discussions'] as const,
  byLead: (leadId: string) => [...discussionKeys.all, leadId] as const,
};

export const useDiscussions = (leadId: string | null) => {
  return useQuery({
    queryKey: discussionKeys.byLead(leadId!),
    queryFn: () => discussionsApi.listByLead(leadId!),
    enabled: !!leadId,
  });
};

export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: CreateDiscussionDto }) =>
      discussionsApi.create(leadId, data),
    onSuccess: (_, variables) => {
      // Invalidate both discussions and leads (since lead's follow_up_at changes!)
      queryClient.invalidateQueries({ queryKey: discussionKeys.byLead(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.leadId) });
    },
  });
};
