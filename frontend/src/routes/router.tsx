import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout/RootLayout.tsx';
import MainPage from '../pages/Main/MainPage.tsx';
import ImagesPage from '../pages/Images/Images.tsx';
import { Paths } from './paths.ts';

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
