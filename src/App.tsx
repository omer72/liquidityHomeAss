import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './App.css';
import SwaTable from './pages/SwaTablePage';
import CharacterPage from './pages/CharacterPage';
import CharactersList from './pages/CharactersListPage';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<SwaTable />} />
          <Route path="/:type" element={<CharactersList />} />
          <Route path="/:type/id/:id" element={<CharacterPage />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
