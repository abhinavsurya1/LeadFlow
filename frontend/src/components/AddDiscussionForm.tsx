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
      className="relative z-20 border-t border-gray-200/85 bg-gradient-to-b from-white via-white to-[#f9fafb] px-5 py-4 shadow-[0_-1px_0_rgba(15,23,42,0.05),0_-16px_44px_-18px_rgba(15,23,42,0.07)]"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3.5">
        <textarea
          className="min-h-[92px] w-full resize-none rounded-lg border border-gray-200/95 bg-white px-3.5 py-3 text-[13px] leading-relaxed text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-200 ease-out-soft focus:border-blue-400/80 focus:outline-none focus:ring-[3px] focus:ring-blue-500/12"
          placeholder="Type a note about this discussion…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 text-[13px] text-gray-500">
            <Calendar className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.75} />
            <span className="hidden sm:inline">Next follow-up</span>
            <input
              type="date"
              className="min-h-[40px] rounded-lg border border-gray-200/90 bg-white px-2.5 py-1.5 text-[13px] text-gray-800 tabular-nums transition-[border-color,box-shadow] duration-150 ease-out-soft focus:border-blue-400/80 focus:outline-none focus:ring-[3px] focus:ring-blue-500/12"
              value={followUpAt}
              onChange={(e) => setFollowUpAt(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={createDiscussion.isPending || !note.trim()}
            className="tap-scale inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-[0_1px_2px_rgba(37,99,235,0.25)] ring-1 ring-blue-700/10 transition-[background-color,transform,opacity,box-shadow] duration-200 ease-out-soft hover:bg-blue-700 hover:shadow-[0_2px_8px_-2px_rgba(37,99,235,0.35)] active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
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
