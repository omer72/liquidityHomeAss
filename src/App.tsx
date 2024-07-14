import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './App.css';
import SwaTable from './components/SwaTable';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CharacterPage from './components/CharacterPage';
import CharactersList from './components/CharactersList';

const queryClient = new QueryClient();

function App() {
  


  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<SwaTable />} />
          <Route path="/:type/:id" element={<CharacterPage />} />
          <Route path="/:type" element={<CharactersList />} />   
        </Routes>
    </Router>
     
      
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
