import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, isRouteErrorResponse, Link, useRouteError } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from './layout/MainLayout.jsx';
import Home from './Pages/Home.jsx';
import AddNotice from './components/AddNotice.jsx';
import DraftNotices from './Pages/DraftNotices.jsx';
import API_URL from './config.js';


const fetchNotices = async (query = '') => {
  const res = await fetch(`${API_URL}/notices${query}`);
  if (!res.ok) {
    throw new Response('Failed to load notices', { status: res.status });
  }
  return res.json();
};


const fetchNotice = async ({ params }) => {
  const res = await fetch(`${API_URL}/notices/${params.id}`);
  if (!res.ok) {
    throw new Response('Failed to load notice', { status: res.status });
  }
  return res.json();
};



const LoadingScreen = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-100 text-gray-700">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-orange-600"></div>
    <p>Loading...</p>
    <p className="px-4 text-center text-sm text-gray-500">
      The server may take a little while to wake up on the first visit.
    </p>
  </div>
);


const ErrorPage = () => {
  const error = useRouteError();
  const notFound =
    isRouteErrorResponse(error) && (error.status === 404 || error.status === 400);

  return (
    <div className="p-8 text-center text-gray-700">
      <p className="mb-4">
        {notFound
          ? 'The notice you are looking for was not found.'
          : 'Something went wrong while loading. Please refresh and try again.'}
      </p>
      <Link to="/" className="text-orange-700 underline">
        Back to notices
      </Link>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
      HydrateFallback: LoadingScreen,
    children: [
      {
        // Pathless route: errors show inside the layout, so the header and sidebar stay
        ErrorBoundary: ErrorPage,
        children: [
          {
            index: true,
            loader: () => fetchNotices(),
            Component: Home
          },
          {
            path: "notice-board",
            Component: AddNotice
          },
          {
            path: "notice-board/:id",
            loader: fetchNotice,
            Component: AddNotice
          },
          {
            path: "draft-notices",
            loader: () => fetchNotices('?status=Unpublished'),
            Component: DraftNotices
          }
        ]
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)