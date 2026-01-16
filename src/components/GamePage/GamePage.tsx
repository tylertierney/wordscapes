import { toast } from 'react-toastify'
import { Link, useLoaderData } from 'react-router-dom'
import type { Answers, Puzzle, LoaderData } from '../../models/models'
import styles from './GamePage.module.scss'
import Crossword from '../Crossword/Crossword'
import { useState } from 'react'
import Controls from '../Controls/Controls'

export default function GamePage() {
  const { puzzle, puzzlesLength, answersFromLocal } =
    useLoaderData() as LoaderData

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

        <Controls
          puzzle={puzzle}
          handleAnswer={handleAnswer}
          style={{
            alignSelf: 'center',
          }}
        />
      </div>
    </div>
  )
}
