import { useStore } from '../store/useStore';
import { useLead } from '../hooks/useLeads';
import { useDiscussions } from '../hooks/useDiscussions';
import { format } from 'date-fns';
import { MessageSquare, Building2, Phone, Calendar } from 'lucide-react';
import { StatusDropdown } from './StatusDropdown';
import { AddDiscussionForm } from './AddDiscussionForm';
import { EditLeadDialog } from './EditLeadDialog';

export function LeadDetail() {
  const selectedLeadId = useStore((state) => state.selectedLeadId);
  const { data: lead, isLoading: isLoadingLead } = useLead(selectedLeadId);
  const { data: discussions, isLoading: isLoadingDiscussions } = useDiscussions(selectedLeadId);

  if (!selectedLeadId) {
    return (
      <div className="relative z-10 flex min-h-0 flex-1 flex-col bg-transparent">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:radial-gradient(rgb(148_163_184/0.09)_1px,transparent_1px)] [background-size:22px_22px]"
          aria-hidden
        />
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-[max(4.5rem,11vh)] pt-10">
          <div className="w-full max-w-[22rem] rounded-2xl border border-gray-200/70 bg-white px-8 py-10 shadow-[0_2px_24px_-12px_rgba(15,23,42,0.07)]">
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gray-200/70 bg-white/80 text-gray-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                aria-hidden
              >
                <MessageSquare className="h-[26px] w-[26px]" strokeWidth={1.15} />
              </div>
              <h2 className="text-base font-semibold tracking-tight text-gray-900">
                No Lead Selected
              </h2>
              <p className="mt-2.5 max-w-[280px] text-sm leading-relaxed text-gray-500">
                Select a lead from the sidebar to view discussion history and manage follow-ups.
              </p>
              <div className="my-6 h-px w-full max-w-[240px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" role="presentation" />
              <ul className="w-full space-y-2.5 text-left text-[13px] leading-snug text-gray-500">
                <li className="flex gap-2.5">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-gray-300" aria-hidden />
                  <span>Track conversations</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-gray-300" aria-hidden />
                  <span>Schedule follow-ups</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-gray-300" aria-hidden />
                  <span>Update lead statuses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingLead || isLoadingDiscussions) {
    return (
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
        <div className="animate-pulse border-b border-gray-100 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
          <div className="flex justify-between gap-4">
            <div className="space-y-3">
              <div className="h-8 w-48 rounded-lg bg-gray-100" />
              <div className="flex gap-3">
                <div className="h-4 w-28 rounded bg-gray-100" />
                <div className="h-4 w-24 rounded bg-gray-100" />
              </div>
            </div>
            <div className="h-9 w-28 rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-[#f7f8f9] to-[#f0f1f3] p-6">
          <div className="mb-6 h-5 w-36 rounded bg-gray-200/80" />
          <div className="mx-auto max-w-2xl space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100/90 bg-white p-4 shadow-sm">
                <div className="mb-3 h-3 w-40 rounded bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-[92%] rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="relative z-10 flex flex-1 items-center justify-center bg-white text-sm text-red-600">
        Lead not found.
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="relative z-10 border-b border-gray-100/90 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-semibold tracking-tight text-gray-900">{lead.name}</h2>
              <EditLeadDialog lead={lead} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              {lead.company && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{lead.company}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="h-4 w-4 shrink-0" />
                Added {format(new Date(lead.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <StatusDropdown leadId={lead.id} currentStatus={lead.status} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-[#f7f8f9] via-[#f5f6f8] to-[#eef0f3] p-6">
        <div className="mx-auto max-w-2xl">
          <h3 className="sticky top-0 z-10 mb-6 bg-gradient-to-b from-[#f7f8f9] via-[#f7f8f9]/95 to-transparent pb-2 pt-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Activity timeline
          </h3>

          <div className="space-y-1">
            {discussions?.map((discussion, index) => (
              <div key={discussion.id} className="relative pl-9">
                {index !== discussions.length - 1 && (
                  <div className="absolute bottom-0 left-[18px] top-10 w-px bg-gradient-to-b from-gray-200 via-gray-200/90 to-transparent" aria-hidden />
                )}

                <div className="absolute left-[13px] top-3 z-[1] h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500 shadow-sm ring-2 ring-blue-500/15" />

                <article className="mb-6 rounded-xl border border-gray-100/90 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-[box-shadow,transform] duration-200 ease-out-soft hover:-translate-y-px hover:shadow-[0_4px_16px_-6px_rgba(15,23,42,0.1)]">
                  <div className="mb-2.5 flex items-center gap-2 text-[11px] font-medium tabular-nums text-gray-400">
                    <MessageSquare className="h-3.5 w-3.5 text-gray-300" aria-hidden />
                    <time dateTime={discussion.createdAt}>
                      {format(new Date(discussion.createdAt), 'MMM d, yyyy · h:mm a')}
                    </time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{discussion.note}</p>
                  {discussion.followUpAt && (
                    <div className="mt-4 inline-flex items-center rounded-md border border-blue-100/90 bg-blue-50/90 px-2.5 py-1.5 text-xs font-medium text-blue-800">
                      <Calendar className="mr-1.5 h-3.5 w-3.5 text-blue-600/80" />
                      Follow-up {format(new Date(discussion.followUpAt), 'MMM d, yyyy')}
                    </div>
                  )}
                </article>
              </div>
            ))}

            {(!discussions || discussions.length === 0) && (
              <div className="rounded-xl border border-dashed border-gray-200/90 bg-white/70 py-14 text-center shadow-sm">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">No activity recorded yet.</p>
                <p className="mt-1 text-xs text-gray-400">Add a note below to start the timeline.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddDiscussionForm leadId={lead.id} />
    </div>
  );
}
