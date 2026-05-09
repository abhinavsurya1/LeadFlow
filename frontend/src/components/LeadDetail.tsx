import React from 'react';
import { useStore } from '../store/useStore';
import { useLead } from '../hooks/useLeads';
import { useDiscussions } from '../hooks/useDiscussions';
import { format } from 'date-fns';
import { Loader2, MessageSquare, Building2, Phone, Calendar } from 'lucide-react';
import { StatusDropdown } from './StatusDropdown';
import { AddDiscussionForm } from './AddDiscussionForm';
import { EditLeadDialog } from './EditLeadDialog';

export function LeadDetail() {
  const selectedLeadId = useStore((state) => state.selectedLeadId);
  const { data: lead, isLoading: isLoadingLead } = useLead(selectedLeadId);
  const { data: discussions, isLoading: isLoadingDiscussions } = useDiscussions(selectedLeadId);

  if (!selectedLeadId) {
    return (
      <div className="relative flex h-full min-h-0 flex-1 flex-col bg-gradient-to-b from-gray-50 via-[#fafbfc] to-gray-100/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(rgb(148_163_184/0.11)_1px,transparent_1px)] [background-size:20px_20px]"
          aria-hidden
        />
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-[max(4.5rem,11vh)] pt-10">
          <div className="w-full max-w-[22rem] rounded-xl border border-gray-200/70 bg-white px-8 py-10 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gray-200/80 bg-gray-50 text-gray-400"
                aria-hidden
              >
                <MessageSquare className="h-[26px] w-[26px]" strokeWidth={1.15} />
              </div>
              <h2 className="text-[15px] font-semibold tracking-tight text-gray-800">
                No Lead Selected
              </h2>
              <p className="mt-2.5 max-w-[280px] text-sm leading-relaxed text-gray-500">
                Select a lead from the sidebar to view discussion history and manage follow-ups.
              </p>
              <div className="my-6 h-px w-full max-w-[240px] bg-gray-100" role="presentation" />
              <ul className="w-full space-y-2.5 text-left text-[13px] leading-snug text-gray-400">
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
      <div className="flex-1 flex items-center justify-center bg-white h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white h-full text-red-500">
        Lead not found.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white shadow-sm z-10 relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
              <EditLeadDialog lead={lead} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
              {lead.company && (
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                  {lead.company}
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                  {lead.phone}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                Added {format(new Date(lead.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <StatusDropdown leadId={lead.id} currentStatus={lead.status} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 sticky top-0 bg-gray-50 py-2 z-10">Activity Timeline</h3>
        
        <div className="space-y-6 max-w-3xl">
          {discussions?.map((discussion, index) => (
            <div key={discussion.id} className="relative pl-8">
              {/* Vertical line connecting timeline dots */}
              {index !== discussions.length - 1 && (
                <div className="absolute top-3 bottom-[-36px] left-[15px] w-0.5 bg-gray-200" />
              )}
              
              {/* Timeline dot */}
              <div className="absolute top-2.5 left-[11px] w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-gray-50" />
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-shadow hover:shadow-md">
                <div className="text-xs text-gray-500 mb-3 font-medium flex items-center">
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  {format(new Date(discussion.createdAt), 'MMM d, yyyy · h:mm a')}
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{discussion.note}</p>
                {discussion.followUpAt && (
                  <div className="mt-4 inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md border border-blue-100">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Follow-up scheduled: {format(new Date(discussion.followUpAt), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {(!discussions || discussions.length === 0) && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No activity recorded yet.</p>
              <p className="text-gray-400 text-xs mt-1">Add a note below to start the timeline.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Discussion Form */}
      <AddDiscussionForm leadId={lead.id} />
    </div>
  );
}
