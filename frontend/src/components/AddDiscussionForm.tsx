import { useState, type FormEvent } from 'react';
import { useCreateDiscussion } from '../hooks/useDiscussions';
import { Send, Calendar } from 'lucide-react';

interface AddDiscussionFormProps {
  leadId: string;
}

export function AddDiscussionForm({ leadId }: AddDiscussionFormProps) {
  const [note, setNote] = useState('');
  const [followUpAt, setFollowUpAt] = useState('');
  
  const createDiscussion = useCreateDiscussion();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    createDiscussion.mutate(
      {
        leadId,
        data: {
          note,
          followUpAt: followUpAt ? new Date(followUpAt).toISOString() : undefined,
        },
      },
      {
        onSuccess: () => {
          setNote('');
          setFollowUpAt('');
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-20 border-t border-gray-200/90 bg-gradient-to-b from-white to-[#fafbfc] p-4 shadow-[0_-12px_40px_-16px_rgba(15,23,42,0.08)]"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <textarea
          className="min-h-[88px] w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-200 ease-out-soft focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/15"
          placeholder="Type a note about this discussion..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="hidden sm:inline">Next follow-up</span>
            <input
              type="date"
              className="min-h-[40px] rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 transition-[border-color] duration-150 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/15"
              value={followUpAt}
              onChange={(e) => setFollowUpAt(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={createDiscussion.isPending || !note.trim()}
            className="tap-scale inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-[background-color,transform,opacity] duration-200 ease-out-soft hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-45"
          >
            {createDiscussion.isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </span>
            ) : (
              <>
                <Send className="mr-2 hidden h-4 w-4 sm:inline" />
                Add note
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
