import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, isRouteErrorResponse, Link, useRouteError } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from './layout/MainLayout.jsx';
import Home from './Pages/Home.jsx';
import AddNotice from './components/AddNotice.jsx';
import DraftNotices from './Pages/DraftNotices.jsx';
import PageSkeleton from './components/PageSkeleton.jsx';
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


const LoadingScreen = () => {
  const [slow, setSlow] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const variant = window.location.pathname.startsWith('/notice-board') ? 'form' : 'list';

  return (
    <div className="grid min-h-screen grid-cols-12">
      <aside className="hidden animate-pulse bg-white p-4 motion-reduce:animate-none lg:col-span-2 lg:block">
        <div className="mb-6 mt-5 h-8 w-32 rounded bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-8 rounded bg-gray-200" />
          ))}
        </div>
      </aside>

      <section className="col-span-12 flex min-h-screen flex-col lg:col-span-10">
        <div className="flex h-16 shrink-0 animate-pulse items-center justify-between bg-white px-4 shadow motion-reduce:animate-none md:px-6">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-3 w-28 rounded bg-gray-200" />
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200" />
        </div>

        <div className="flex-1 bg-gray-100 p-4 md:p-6">
          {slow && (
            <p
              aria-live="polite"
              className="mb-4 rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800"
            >
              The server is waking up after being idle. This can take up to a minute on the first visit, please wait.
            </p>
          )}
          <PageSkeleton variant={variant} />
        </div>
      </section>
    </div>
  );
};

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