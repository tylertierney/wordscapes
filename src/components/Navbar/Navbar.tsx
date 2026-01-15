import { Link } from 'react-router-dom'
import useTheme from '../../hooks/useTheme'
import styles from './Navbar.module.scss'
import { moonIcon } from '../../svg/moon'
import { sunIcon } from '../../svg/sun'
import Button from '../Button/Button'
import { wordscapesIcon } from '../../svg/wordscapes'

export default function Navbar() {
  const [lightTheme, setLightTheme] = useTheme()

  return (
    <nav className={styles.nav}>
      <Link className={styles.logo} to="/">
        {wordscapesIcon}
      </Link>
      <Button
        style={{ fill: 'var(--text-color-primary)' }}
        onClick={() => setLightTheme((prev) => !prev)}
      >
        {lightTheme ? moonIcon : sunIcon}
      </Button>
    </nav>
  )
}
