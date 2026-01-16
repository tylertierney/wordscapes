import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import type { Answers, Coords, Puzzle } from '../../models/models'
import styles from './Crossword.module.scss'
import type { AnimatedTilesDef } from '../Game/Game'

type Props = {
  puzzle: Puzzle
  answers: Answers
  animatedTiles: AnimatedTilesDef | null
  style?: CSSProperties
}

export default function Crossword({
  puzzle,
  answers,
  animatedTiles,
  style = {},
}: Props) {
  const [activeAnimations, setActiveAnimations] =
    useState<AnimatedTilesDef | null>()
  const crosswordRef = useRef<HTMLDivElement | null>(null)

  const { width, height } = puzzle.board

  const diff = width - height

  const emptyRowsAtEnd = Math.max(diff, 0)

  const rows = puzzle.board.rows.map((row) => row.split(','))

  const max = Math.max(width, height)

  const solved: Record<string, Coords[]> = {}

  for (const ans of answers.words) {
    solved[ans] = puzzle.solutions[ans] || []
  }

  const allSolvedCoords = Object.values(solved).flat()

  useEffect(() => {
    if (animatedTiles?.coords.length) {
      setActiveAnimations(animatedTiles)
    }
  }, [animatedTiles])

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

        const animationIndex =
          activeAnimations?.coords.findIndex(([x, y]) => x === r && y === c) ??
          -1

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
              animationDelay:
                animationIndex > -1 ? animationIndex * 0.1 + 's' : 'unset',
              animationName: animationIndex > -1 ? activeAnimations?.name : '',
              animationDuration: '900ms',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
            }}
            onAnimationEnd={() => {
              setActiveAnimations((prev) => {
                if (!prev) return null
                return {
                  ...prev,
                  coords: [...prev.coords.slice(1)],
                }
              })
            }}
          >
            {solved || hint ? char : ''}
            {/* <span className={styles.debug}>
              {r}, {c}
            </span> */}
          </div>
        )
      }
    }

    return res
  }

  useEffect(() => {
    const curr = crosswordRef.current
    if (!curr) return

    const tile = curr.firstElementChild

    const rect = tile?.getBoundingClientRect()

    const tileHeight = rect?.height || 0

    curr.style.marginBottom = -1 * (tileHeight * emptyRowsAtEnd) + 'px'
  }, [crosswordRef])

  return (
    <div
      ref={crosswordRef}
      className={styles.crossword}
      style={{
        gridTemplateColumns: `repeat(${max}, 1fr)`,
        gridTemplateRows: `repeat(${max}, 1fr)`,
        ...style,
      }}
    >
      {...buildBoard()}
    </div>
  )
}
