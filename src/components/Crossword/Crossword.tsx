import type { CSSProperties, ReactNode } from 'react'
import type { Answers, Coords, Puzzle } from '../../models/models'
import styles from './Crossword.module.scss'

type Props = {
  puzzle: Puzzle
  answers: Answers
  style?: CSSProperties
}

export default function Crossword({ puzzle, answers, style = {} }: Props) {
  const { width, height } = puzzle.board

  const diff = width - height

  const emptyRowsAtEnd = Math.min(diff > -1 ? diff : 0, 0)

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
        const key = r * max + c
        const char: string | undefined = rows[r]?.[c]
        const solved =
          allSolvedCoords.findIndex(([y, x]) => y === r && x === c) > -1
        const hint =
          answers.hintsUsed.findIndex(([x, y]) => x === r && y === c) > -1
        res.push(
          <div
            key={key}
            className={`
              ${styles.tile} 
              ${!char || char === '·' ? styles.blank : ''}
              ${solved ? styles.solved : ''}
              ${hint ? styles.hint : ''}
              `}
            style={{
              fontSize: width > 11 ? '16px' : '24px',
            }}
          >
            {solved || hint ? char : ''}
            <span className={styles.debug}>
              {r}, {c}
            </span>
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
        marginBottom: -1 * 50 * emptyRowsAtEnd + 'px',
        ...style,
      }}
    >
      {...buildBoard()}
    </div>
  )
}
