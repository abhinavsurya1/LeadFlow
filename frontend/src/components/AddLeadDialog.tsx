import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
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
        <button className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-md z-50 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Create New Lead
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s.replace(/([A-Z])/g, ' $1').trim()}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={createLead.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createLead.isPending ? 'Creating...' : 'Create Lead'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
