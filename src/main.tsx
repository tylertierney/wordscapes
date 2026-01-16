import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import puzzlesArr from '../puzzles.json' with {type: 'json'}
import type { Puzzle, LoaderData } from './models/models.ts'
import GamePage from './components/GamePage/GamePage.tsx'
import Home from './components/Home/Home.tsx'
import { getAnswersFromLocalStorage } from './utils/utils'
import ErrorPage from './components/ErrorPage/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
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
          console.log(getAnswersFromLocalStorage(found as Puzzle))
          const res: LoaderData = {
            puzzle: found as Puzzle,
            puzzlesLength: puzzles.length,
            answersFromLocal: getAnswersFromLocalStorage(found as Puzzle) ?? {
              words: [],
              bonusWords: [],
              hintsUsed: [],
            },
          }
          return res
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
