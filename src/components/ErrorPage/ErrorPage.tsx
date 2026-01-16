import styles from './ErrorPage.module.scss'
import { Link } from 'react-router-dom'
import Button from '../Button/Button'

export default function ErrorPage() {
  return (
    <div className={styles.errorPage}>
      <span className={styles.emoji}>🥲</span>
      <p className={styles.p}>Something went wrong...</p>
      <p className={styles.p}>A game doesn't exist with the provided ID.</p>
      <p className={styles.p}>
        You can go back to the full games list and try again.
      </p>
      <Link className={styles.link} to='/'>
        <Button style={{ textDecoration: 'none' }}>Go back home</Button>
      </Link>
    </div>
  )
}
