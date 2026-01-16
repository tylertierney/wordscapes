import { Link } from 'react-router-dom'
import styles from './Home.module.scss'
import puzzlesArr from '../../../puzzles.json'
import { type Puzzle, type Answers } from '../../models/models'
import Badge from '../Badge/Badge'
import {
  getAnswersFromLocalStorage,
  isGameCompleted,
  isGameInProgress,
} from '../../utils/utils'
import { type ReactNode } from 'react'
import Navbar from '../Navbar/Navbar'

const puzzles = (
  puzzlesArr as unknown as Puzzle[]
).toReversed() as unknown as Puzzle[]

const getBadge = (
  p: Puzzle,
  answers: Answers | null | undefined
): ReactNode | null => {
  if (!answers) return null

  if (isGameCompleted(p, answers)) {
    return (
      <Badge size='sm' type='success' style={{ marginRight: '1rem' }}>
        Complete
      </Badge>
    )
  }

  if (isGameInProgress(answers)) {
    return (
      <Badge size='sm' type='warning' style={{ marginRight: '1rem' }}>
        In Progress
      </Badge>
    )
  }
}

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.home}>
        {puzzles.map((p) => {
          return (
            <Link
              id={String(p.level)}
              key={p.level}
              to={`/puzzles/${p.level}`}
              className={styles.level}
            >
              <span className={styles.levelLiteral}>Level {p.level}</span>
              <div className={styles.arrowAndBadge}>
                {getBadge(p, getAnswersFromLocalStorage(p))}
                <span>&rarr;</span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
