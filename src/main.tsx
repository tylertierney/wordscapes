import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import puzzlesArr from './puzzles/puzzles.json'
import type { Puzzle } from './models/models.ts'
import GamePage from './components/GamePage/GamePage.tsx'
import Home from './components/Home/Home.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>ahhh something went wrong</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'puzzles/:puzzleIndex',
        element: <GamePage />,
        loader: ({ params }) => {
          const puzzles = puzzlesArr as unknown as Puzzle[]
          const asNumber = parseInt(params.puzzleIndex ?? '1', 10)
          const found = puzzles.find(({ level }) => level === asNumber) ?? null
          return found
        },
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
)
