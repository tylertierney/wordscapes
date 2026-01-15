import { Link } from 'react-router-dom'
import styles from './Home.module.scss'
import puzzlesArr from '../../puzzles/puzzles.json'
import { type Puzzle } from '../../models/models'

const puzzles = puzzlesArr.toReversed() as unknown as Puzzle[]

console.log(puzzles)

export default function Home() {
  return (
    <div className={styles.home}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={`${styles.th} ${styles.id}`} scope="col">
              Level
            </th>
            <th className={`${styles.th} ${styles.completed}`} scope="col">
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
      </table>
    </div>
  )
}
