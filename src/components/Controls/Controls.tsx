import styles from './Controls.module.scss'
import { useEffect, useState, type CSSProperties } from 'react'
import { type Puzzle } from '../../models/models.ts'
import Button from '../Button/Button'
import LetterWheel from '../LetterWheel/LetterWheel'
import { shuffleArray } from '../../utils/utils'
import { shuffleIcon } from '../../svg/shuffle.tsx'

type Props = {
  puzzle: Puzzle
  handleAnswer: (str: string) => void
  style?: CSSProperties
}

export default function Controls({ puzzle, handleAnswer, style = {} }: Props) {
  const [letters, setLetters] = useState('')
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    setLetters(puzzle.letters)
  }, [puzzle])

  return (
    <div className={styles.controls} style={style}>
      <div className={styles.letters}>{currentText}</div>
      <div className={styles.controlsBottom}>
        <Button
          style={{
            borderRadius: '100%',
            height: '60px',
            width: '60px',
            fill: 'var(--text-color-primary)',
            padding: '0',
            border: 'none',
            backgroundColor: 'var(--letter-wheel-bg)',
            boxShadow: 'var(--letter-wheel-shadow-sm)',
          }}
          onClick={() =>
            setLetters((prev) => shuffleArray(prev.split('')).join(''))
          }
        >
          {shuffleIcon}
        </Button>
        <LetterWheel
          setCurrentText={setCurrentText}
          handleAnswer={handleAnswer}
          letters={letters}
        />
      </div>
    </div>
  )
}
