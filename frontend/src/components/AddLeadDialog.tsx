import { useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';
import { useCreateLead } from '../hooks/useLeads';
import { LeadStatus } from '../types';

export function AddLeadDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New');

  const createLead = useCreateLead();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createLead.mutate(
      {
        name,
        company: company || undefined,
        phone: phone || undefined,
        status,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName('');
          setCompany('');
          setPhone('');
          setStatus('New');
        },
      }
    );
  };

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'ProposalSent', 'Won', 'Lost'];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="tap-scale flex w-full min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-[background-color,transform] duration-200 ease-out-soft hover:bg-blue-700 active:bg-blue-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)] duration-200 ease-out-soft data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Create New Lead
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 transition-[border-color,box-shadow] duration-150 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 transition-[border-color,box-shadow] duration-150 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 transition-[border-color,box-shadow] duration-150 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-3 py-2 transition-[border-color,box-shadow] duration-150 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s.replace(/([A-Z])/g, ' $1').trim()}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="tap-scale rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={createLead.isPending}
                className="tap-scale rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-[background-color,opacity,transform] duration-200 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-45"
              >
                {createLead.isPending ? 'Creating…' : 'Create Lead'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
