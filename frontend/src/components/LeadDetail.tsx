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
          className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgb(148_163_184/0.08)_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden
        />
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-[max(5rem,12vh)] pt-8">
          <div className="w-full max-w-[21rem] rounded-2xl border border-gray-200/60 bg-white/95 px-7 py-9 shadow-[0_2px_20px_-10px_rgba(15,23,42,0.06)] ring-1 ring-gray-900/[0.03]">
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200/60 bg-gray-50/80 text-gray-400"
                aria-hidden
              >
                <MessageSquare className="h-[22px] w-[22px]" strokeWidth={1.2} />
              </div>
              <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                No lead selected
              </h2>
              <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-gray-500">
                Select a lead from the sidebar to view discussion history and manage follow-ups.
              </p>
              <div className="my-5 h-px w-full max-w-[220px] bg-gradient-to-r from-transparent via-gray-200/90 to-transparent" role="presentation" />
              <ul className="w-full space-y-2 text-left text-[12px] leading-snug text-gray-500">
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
      <div className="relative z-10 border-b border-gray-100/90 bg-white px-6 py-5 shadow-[0_1px_0_rgba(15,23,42,0.035)]">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-[1.375rem] font-semibold leading-tight tracking-tight text-gray-900">{lead.name}</h2>
              <EditLeadDialog lead={lead} />
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] leading-snug text-gray-500">
              {lead.company && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>{lead.company}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-1.5 tabular-nums">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[11px] font-normal tabular-nums text-gray-400">
                <Calendar className="h-3.5 w-3.5 shrink-0 opacity-80" />
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
      <div className="relative flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-[#f8f9fa] via-[#f5f6f8] to-[#eef0f3] px-6 pb-2 pt-5">
        <div className="mx-auto max-w-2xl">
          <h3 className="sticky top-0 z-10 -mx-1 mb-5 bg-gradient-to-b from-[#f8f9fa] from-70% via-[#f8f9fa]/90 to-transparent pb-3 pt-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">
            Activity timeline
          </h3>

          <ul className="m-0 list-none p-0">
            {discussions?.map((discussion, index) => {
              const isLast = index === discussions.length - 1;
              return (
                <li key={discussion.id} className="flex gap-4 pb-8 last:pb-0">
                  <div className="relative flex w-5 shrink-0 justify-center self-stretch pt-0.5">
                    {!isLast && (
                      <div
                        className="absolute left-1/2 top-[15px] bottom-0 w-px -translate-x-1/2 bg-gray-200/90"
                        aria-hidden
                      />
                    )}
                    <div className="relative z-[1] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.18)]" />
                  </div>

                  <article className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-white p-[14px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[box-shadow,transform,border-color] duration-200 ease-out-soft hover:-translate-y-px hover:border-gray-200/90 hover:shadow-[0_4px_14px_-8px_rgba(15,23,42,0.08)]">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-medium tabular-nums tracking-wide text-gray-400">
                      <MessageSquare className="h-3 w-3 text-gray-300" aria-hidden strokeWidth={1.5} />
                      <time dateTime={discussion.createdAt}>
                        {format(new Date(discussion.createdAt), 'MMM d, yyyy · h:mm a')}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap text-[13px] leading-[1.55] text-gray-800">{discussion.note}</p>
                    {discussion.followUpAt && (
                      <div className="mt-3.5 inline-flex items-center rounded-md border border-blue-100/80 bg-blue-50/80 px-2 py-1 text-[11px] font-medium text-blue-900/90">
                        <Calendar className="mr-1.5 h-3 w-3 text-blue-600/75" strokeWidth={1.75} />
                        Follow-up {format(new Date(discussion.followUpAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>

          {(!discussions || discussions.length === 0) && (
            <div className="rounded-xl border border-dashed border-gray-200/80 bg-white/80 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <MessageSquare className="mx-auto mb-2.5 h-7 w-7 text-gray-300" strokeWidth={1.25} />
              <p className="text-[13px] font-medium text-gray-600">No activity recorded yet.</p>
              <p className="mt-1 text-[12px] text-gray-400">Add a note below to start the timeline.</p>
            </div>
          )}
        </div>
      </div>

      <AddDiscussionForm leadId={lead.id} />
    </div>
  );
}
