import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from './layout/MainLayout.jsx';
import Home from './Pages/Home.jsx';
import AddNotice from './components/AddNotice.jsx';
import DraftNotices from './Pages/DraftNotices.jsx';
import API_URL from './config.js';


const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children:[
       {
        path: "", 
         loader: () => fetch(`${API_URL}/notices`),   
        Component: Home
      },
      {
        path: "notice-board",  
        Component: AddNotice
      },
      {
        path: "draft-notices",
        loader: () => fetch(`${API_URL}/notices`),
        Component: DraftNotices
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)