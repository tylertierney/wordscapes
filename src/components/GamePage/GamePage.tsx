import { useLoaderData } from 'react-router-dom'
import type { LoaderData } from '../../models/models'
import Game from '../Game/Game'
import Navbar from '../Navbar/Navbar'

export default function GamePage() {
  const { puzzle, answersFromLocal, puzzlesLength } =
    useLoaderData() as LoaderData

  return (
    <>
      <Navbar homeLink={`/#${puzzle.level}`} />
      <Game
        key={puzzle.level}
        puzzle={puzzle}
        answersFromLocal={answersFromLocal}
        puzzlesLength={puzzlesLength}
      ></Game>
    </>
  )
}
