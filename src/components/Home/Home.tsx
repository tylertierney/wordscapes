import { Link } from 'react-router-dom'
import styles from './Home.module.scss'
import puzzlesArr from '../../../puzzles.json'
import { type Puzzle, type Answers } from '../../models/models'

const puzzles = (
  puzzlesArr as unknown as Puzzle[]
).toReversed() as unknown as Puzzle[]

const getAnswersFromLocalStorage = (p: Puzzle): Answers | null => {
  const fromLocalStorage = localStorage.getItem(
    `wordscapes-state-${String(p.level)}`
  )
  if (!fromLocalStorage) {
    return null
  }
  return JSON.parse(fromLocalStorage) as Answers
}

export default function Home() {
  return (
    <div className={styles.home}>
      {puzzles.map((p) => {
        return (
          <Link to={`/puzzles/${p.level}`} className={styles.level}>
            <span className={styles.levelLiteral}>Level {p.level}</span>
            <div className={styles.arrowAndBadge}>
              <span>&rarr;</span>
            </div>
          </Link>
        )
      })}
      {/* <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={`${styles.th} ${styles.id}`} scope='col'>
              Level
            </th>
            <th className={`${styles.th} ${styles.completed}`} scope='col'>
              Completed
            </th>
          </tr>
        </thead>
        <tbody>
          {puzzles.map((puzzle, key) => (
            <tr key={key}>
              <td className={`${styles.td} ${styles.level}`}>
                <Link
                  style={{ color: 'var(--text-color-primary)' }}
                  to={`/puzzles/${puzzle.level}`}
                >
                  {puzzle.level}
                </Link>
              </td>
              <td className={`${styles.td} ${styles.completed}`}>idk</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  )
}
