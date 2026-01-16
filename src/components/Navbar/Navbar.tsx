import { type LinkProps } from 'react-router-dom'
import useTheme from '../../hooks/useTheme'
import styles from './Navbar.module.scss'
import { moonIcon } from '../../svg/moon'
import { sunIcon } from '../../svg/sun'
import Button from '../Button/Button'
import { wordscapesIcon } from '../../svg/wordscapes'
import { HashLink } from 'react-router-hash-link'

type Props = {
  homeLink?: LinkProps['to']
}

export default function Navbar({ homeLink = '/' }: Props) {
  const [lightTheme, setLightTheme] = useTheme()

  return (
    <nav className={styles.nav}>
      <HashLink className={styles.logo} to={homeLink}>
        {wordscapesIcon}
      </HashLink>
      <Button
        style={{ fill: 'var(--text-color-primary)' }}
        onClick={() => setLightTheme((prev) => !prev)}
      >
        {lightTheme ? moonIcon : sunIcon}
      </Button>
    </nav>
  )
}
