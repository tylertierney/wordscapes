import Button from '../Button/Button'
import { shuffleIcon } from '../../svg/shuffle'
import { toast } from 'react-toastify'
import { Link, useLoaderData } from 'react-router-dom'
import type { Answers, Puzzle } from '../../models/models'
import styles from './GamePage.module.scss'
import Crossword from '../Crossword/Crossword'
import { useState, useEffect } from 'react'
import LetterWheel from '../LetterWheel/LetterWheel'
import { shuffleArray } from '../../utils/utils'

export default function GamePage() {
  const [answers, setAnswers] = useState<Answers>({
    words: [],
    bonusWords: [],
  })

  const { puzzle, puzzlesLength } = useLoaderData() as {
    puzzle: Puzzle
    puzzlesLength: number
  }

  const { level } = puzzle

  const [letters, setLetters] = useState<string>(puzzle.letters)

  useEffect(() => {
    setLetters(puzzle.letters)
  }, [puzzle])

  const handleAnswer = (text: string) => {
    text = text.toUpperCase().trim()

    if (answers.bonusWords.includes(text) || answers.words.includes(text)) {
      toast('already found', { type: 'error' })
      return
    }

    if (puzzle.bonusWords.includes(text)) {
      toast('found bonus word')
      setAnswers((prev) => ({
        ...prev,
        bonusWords: [...prev.bonusWords, text],
      }))
    }

    if (Object.keys(puzzle.solutions).includes(text)) {
      setAnswers((prev) => ({ ...prev, words: [...prev.words, text] }))
    }

    localStorage.setItem(`wordscapes-state-${level}`, JSON.stringify(answers))
  }

  return (
    <div className={styles.gamePage}>
      <div className={styles.levelAndLinks}>
        <h1 className={styles.level}>Level #{puzzle.level}</h1>
        <div className={styles.links}>
          {level > 1 && (
            <Link className={styles.hoverableLink} to={`/puzzles/${level - 1}`}>
              <span>&larr;</span> Previous Game
            </Link>
          )}
          {level < puzzlesLength && (
            <Link className={styles.hoverableLink} to={`/puzzles/${level + 1}`}>
              Next Game &rarr;
            </Link>
          )}
        </div>
      </div>
      <div className={styles.crosswordAndInputs}>
        <Crossword
          answers={answers}
          puzzle={puzzle}
          style={{ marginBottom: '1rem' }}
        ></Crossword>

        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            alignItems: 'flex-end',
          }}
        >
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
          <LetterWheel handleAnswer={handleAnswer} letters={letters} />
        </div>
      </div>
    </div>
  )
}
