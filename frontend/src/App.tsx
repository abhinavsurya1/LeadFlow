import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LeadFlow CRM</h1>
          <p className="text-gray-500">Frontend scaffolded successfully!</p>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
