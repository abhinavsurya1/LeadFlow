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
      <DropdownMenu.Trigger className="group flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25">
        <StatusBadge status={currentStatus} className="cursor-pointer px-3 py-1 text-sm transition-[box-shadow,transform] duration-150 ease-out-soft group-hover:shadow-sm group-active:scale-[0.99]" />
        <ChevronDown className="ml-1 h-4 w-4 text-gray-400 transition-colors duration-150 group-hover:text-gray-600" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[160px] rounded-lg border border-gray-200/90 bg-white p-1 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12),0_4px_12px_-4px_rgba(15,23,42,0.08)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 duration-150 ease-out-soft"
        >
          {statuses.map((status) => (
            <DropdownMenu.Item
              key={status}
              onClick={() => {
                if (status !== currentStatus) {
                  updateLead.mutate({ id: leadId, data: { status } });
                }
              }}
              className={`cursor-pointer rounded-md px-3 py-2 text-sm outline-none transition-colors duration-150 ease-out-soft
                ${status === currentStatus ? 'bg-blue-50 font-medium text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {status.replace(/([A-Z])/g, ' $1').trim()}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
