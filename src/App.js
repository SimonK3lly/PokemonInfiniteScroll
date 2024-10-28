import './App.css';
import MainContent from './components/MainContent';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MainContent />
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}

export default App;
