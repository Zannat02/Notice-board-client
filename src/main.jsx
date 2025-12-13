import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from './layout/MainLayout.jsx';
import Home from './Pages/Home.jsx';
import AddNotice from './components/AddNotice.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children:[
       {
        path: "",        
        Component: AddNotice
      },
      {
        path: "notice-board",  
        Component: AddNotice
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)
