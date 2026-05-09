import React, { useState } from 'react';
import { useCreateDiscussion } from '../hooks/useDiscussions';
import { Send, Calendar } from 'lucide-react';

interface AddDiscussionFormProps {
  leadId: string;
}

export function AddDiscussionForm({ leadId }: AddDiscussionFormProps) {
  const [note, setNote] = useState('');
  const [followUpAt, setFollowUpAt] = useState('');
  
  const createDiscussion = useCreateDiscussion();

  const handleSubmit = (e: React.FormEvent) => {
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
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 relative">
      <div className="flex flex-col space-y-3">
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none text-sm placeholder-gray-400"
          placeholder="Type a note about this discussion..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span className="mr-2 hidden sm:inline">Next Follow-up:</span>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              value={followUpAt}
              onChange={(e) => setFollowUpAt(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={createDiscussion.isPending || !note.trim()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {createDiscussion.isPending ? 'Saving...' : (
              <>
                <Send className="w-4 h-4 mr-2 hidden sm:inline" />
                Add Note
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
