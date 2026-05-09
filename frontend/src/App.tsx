import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarHeader } from './components/SidebarHeader';
import { LeadList } from './components/LeadList';
import { LeadDetail } from './components/LeadDetail';
import { AddLeadDialog } from './components/AddLeadDialog';
import { Zap } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-[#f4f5f7] text-gray-900 font-sans">
          
          {/* Left Sidebar */}
          <div className="w-[380px] flex flex-col shrink-0 border-r border-gray-200/90 bg-white z-20 shadow-[2px_0_24px_-8px_rgba(15,23,42,0.08),1px_0_0_rgba(15,23,42,0.04)]">
            {/* App Branding */}
            <div className="p-4 border-b border-blue-700 flex items-center bg-blue-600 text-white shadow-sm">
              <Zap className="w-5 h-5 mr-2 fill-current text-yellow-300" />
              <h1 className="text-lg font-bold tracking-tight">LeadFlow</h1>
            </div>
            
            <SidebarHeader />
            <LeadList />
            
            <div className="p-4 border-t border-gray-200/90 bg-[#fafbfc] z-20 relative shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.06)]">
              <AddLeadDialog />
            </div>
          </div>

          {/* Right Main Content Panel */}
          <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-gradient-to-br from-[#f5f6f8] via-[#f0f1f4] to-[#ebecef] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_85%_65%_at_50%_-10%,rgba(255,255,255,0.55)_0%,transparent_55%)] before:opacity-90">
            <LeadDetail />
          </main>

        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
