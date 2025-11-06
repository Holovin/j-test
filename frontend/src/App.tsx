import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { HeaderProvider } from '@/contexts/HeaderContext';
import './App.css';

function App() {
  return (
    <HeaderProvider>
      <RouterProvider router={router} />
    </HeaderProvider>
  );
}

export default App;
