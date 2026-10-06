import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import Jokes from './components/Jokes.jsx'
import DarkJokes from './components/DarkJokes.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,

    children: [
      {
        path: 'Jokes',
        element: <Jokes />
      },
      {
        path: 'DarkJokes',
        element: <DarkJokes />
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)