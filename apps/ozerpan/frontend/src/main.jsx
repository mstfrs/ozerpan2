import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
	createBrowserRouter,
	RouterProvider,
  } from "react-router-dom";
import  { JobCards } from './pages/job-card/JobCards.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import JobCardDetail from './pages/job-card/JobCardDetail.jsx';

  const router = createBrowserRouter([
	{
	  path: "/",
    element: <App/>,
	  children: [
		{
			path: "login",
			element: <Login/>
		  },
		  {
			element:<ProtectedRoute/>,
			children:[
				{
					path: "jobcard",
					element: <JobCards/>
				  },
			 
				{
					path: "jobcard/:id",
					element: <JobCardDetail/>
				  },
			 
				  {
					  path: "tasks",
					  element: <div>Tasks</div>,
					},
			]
		  }
		
	  ],
	 

	},
  ],
{
  basename:import.meta.env.VITE_BASE_PATH
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />

  </StrictMode>,
)
