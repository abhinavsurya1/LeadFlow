import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discussionsApi } from '../lib/api';
import { CreateDiscussionDto, Discussion } from '../types';
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
    onMutate: async ({ leadId, data }) => {
      // Cancel any in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: discussionKeys.byLead(leadId) });

      // Snapshot current discussions for rollback on error
      const snapshot = queryClient.getQueryData<Discussion[]>(discussionKeys.byLead(leadId));

      // Optimistically prepend the new discussion
      queryClient.setQueryData<Discussion[]>(discussionKeys.byLead(leadId), (old) => [
        {
          id: 'optimistic-' + Date.now(),
          leadId,
          note: data.note,
          followUpAt: data.followUpAt ?? null,
          createdAt: new Date().toISOString(),
        },
        ...(old ?? []),
      ]);

      return { snapshot, leadId };
    },
    onError: (_err, _vars, context) => {
      // Roll back to the snapshot if the mutation fails
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(discussionKeys.byLead(context.leadId), context.snapshot);
      }
    },
    onSettled: (_data, _err, variables) => {
      // Always refetch to sync with server after success or error
      queryClient.invalidateQueries({ queryKey: discussionKeys.byLead(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.leadId) });
    },
  });
};
