import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import { HeaderProvider } from './contexts/HeaderContext.tsx';
import './App.css';

function App() {
  return (
    <HeaderProvider>
      <RouterProvider router={router} />
    </HeaderProvider>
  );
}

export default App;
