import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import type { Answers, Puzzle } from '../../models/models'
import styles from './Game.module.scss'
import Crossword from '../Crossword/Crossword'
import { useState } from 'react'
import Controls from '../Controls/Controls'

type Props = {
  puzzle: Puzzle
  answersFromLocal: Answers
  puzzlesLength: number
}

export default function Game({
  puzzle,
  answersFromLocal,
  puzzlesLength,
}: Props) {
  // const { puzzle, puzzlesLength, answersFromLocal } =
  //   useLoaderData() as LoaderData

  const [answers, setAnswers] = useState<Answers>(
    answersFromLocal ?? {
      words: [],
      bonusWords: [],
    }
  )

  const { level } = puzzle

  const handleAnswer = (text: string) => {
    text = text.toUpperCase().trim()

    if (answers.bonusWords.includes(text) || answers.words.includes(text)) {
      toast('already found', { type: 'error' })
      return
    }

    if (puzzle.bonusWords.includes(text)) {
      toast('found bonus word')
      const newAnswers: Answers = {
        ...answers,
        bonusWords: [...answers.bonusWords, text],
      }
      setAnswers(newAnswers)
      localStorage.setItem(
        `wordscapes-state-${level}`,
        JSON.stringify(newAnswers)
      )
    }

    if (Object.keys(puzzle.solutions).includes(text)) {
      const newAnswers: Answers = {
        ...answers,
        words: [...answers.words, text],
      }
      setAnswers(newAnswers)
      localStorage.setItem(
        `wordscapes-state-${level}`,
        JSON.stringify(newAnswers)
      )
    }
  }

  const reset = () => {
    setAnswers({ bonusWords: [], words: [], hintsUsed: [] })
    localStorage.removeItem(`wordscapes-state-${level}`)
  }

  return (
    <div className={styles.game}>
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
        <Crossword answers={answers} puzzle={puzzle}></Crossword>

        <Controls
          puzzle={puzzle}
          handleAnswer={handleAnswer}
          style={{
            alignSelf: 'center',
          }}
          answers={answers}
          setAnswers={setAnswers}
        />
      </div>
      <button className={styles.resetButton} onClick={reset}>
        Reset
      </button>
      <button
        className={styles.resetButton}
        onClick={() => {
          let i = 0
          while (i < 2000) {
            localStorage.removeItem(`wordscapes-state-${i}`)
            i++
          }
        }}
      >
        Reset All
      </button>
    </div>
  )
}
