import type { ReactNode } from 'react'
import type { Answers, Coords, Puzzle } from '../../models/models'
import styles from './Crossword.module.scss'

type Props = {
  puzzle: Puzzle
  answers: Answers
}

export default function Crossword({ puzzle, answers }: Props) {
  const { width, height } = puzzle.board

  const rows = puzzle.board.rows.map((row) => row.split(','))

  const max = Math.max(width, height)

  const solved: Record<string, Coords[]> = {}

  for (const ans of answers.words) {
    solved[ans] = puzzle.solutions[ans] || []
  }

  const allSolvedCoords = Object.values(solved).flat()

  const buildBoard = () => {
    const res: ReactNode[] = []

    for (let r = 0; r < max; r++) {
      for (let c = 0; c < max; c++) {
        const key = r * width + c
        const char: string | undefined = rows[r]?.[c]
        const solved =
          allSolvedCoords.findIndex(([y, x]) => y === r && x === c) > -1
        res.push(
          <div
            key={key}
            className={`
              ${styles.tile} 
              ${!char || char === '·' ? styles.blank : ''}
              ${solved ? styles.solved : ''}
              `}
          >
            {solved ? char : ''}
          </div>
        )
      }
    }

    return res
  }

  return (
    <div
      className={styles.crossword}
      style={{
        gridTemplateColumns: `repeat(${max}, 1fr)`,
        gridTemplateRows: `repeat(${max}, 1fr)`,
      }}
    >
      {...buildBoard()}
    </div>
  )
}
