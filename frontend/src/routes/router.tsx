import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout/RootLayout';
import MainPage from '@/pages/Main/MainPage';
import ImagesPage from '@/pages/Images/Images';
import { Paths } from '@/routes/paths';

export const router = createBrowserRouter([
  {
    path: Paths.root,
    element: <RootLayout/>,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: Paths.images,
        element: <ImagesPage />,
      },
    ],
  },
]);
