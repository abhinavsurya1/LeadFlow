import { useState, useEffect, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, X } from 'lucide-react';
import { useUpdateLead } from '../hooks/useLeads';
import { Lead } from '../types';

interface EditLeadDialogProps {
  lead: Lead;
}

export function EditLeadDialog({ lead }: EditLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(lead.name);
  const [company, setCompany] = useState(lead.company || '');
  const [phone, setPhone] = useState(lead.phone || '');

  const updateLead = useUpdateLead();

  useEffect(() => {
    setName(lead.name);
    setCompany(lead.company || '');
    setPhone(lead.phone || '');
  }, [lead]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateLead.mutate(
      {
        id: lead.id,
        data: {
          name,
          company: company || undefined,
          phone: phone || undefined,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="tap-scale ml-2 rounded-md p-1.5 text-gray-400 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600"
          title="Edit Lead"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)] duration-200 ease-out-soft data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Edit Lead Details
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

            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="tap-scale rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={updateLead.isPending}
                className="tap-scale rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-[background-color,opacity] duration-200 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-45"
              >
                {updateLead.isPending ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
