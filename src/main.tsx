import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Collection from './pages/collection.tsx';
import LoginPage from './pages/LoginPage.tsx';
import App from './App.tsx';
import NewBlog from './components/NewBlog.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/collection",
    element: <Collection />,
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path:"/blogwriter/NewBlog",
    element: <NewBlog/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
