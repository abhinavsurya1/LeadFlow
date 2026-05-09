import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useUpdateLead } from '../hooks/useLeads';
import { LeadStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ChevronDown } from 'lucide-react';

interface StatusDropdownProps {
  leadId: string;
  currentStatus: LeadStatus;
}

export function StatusDropdown({ leadId, currentStatus }: StatusDropdownProps) {
  const updateLead = useUpdateLead();
  const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'ProposalSent', 'Won', 'Lost'];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus:outline-none flex items-center group">
        <StatusBadge status={currentStatus} className="cursor-pointer group-hover:ring-2 ring-blue-200 px-3 py-1 text-sm" />
        <ChevronDown className="w-4 h-4 ml-1 text-gray-400 group-hover:text-gray-600" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="bg-white rounded-md shadow-lg border border-gray-200 p-1 min-w-[140px] z-50 animate-in fade-in zoom-in duration-150"
        >
          {statuses.map((status) => (
            <DropdownMenu.Item
              key={status}
              onClick={() => {
                if (status !== currentStatus) {
                  updateLead.mutate({ id: leadId, data: { status } });
                }
              }}
              className={`px-3 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors
                ${status === currentStatus ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {status.replace(/([A-Z])/g, ' $1').trim()}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
