import JSConfetti from 'js-confetti'
const jsConfetti = new JSConfetti()
import { Link } from 'react-router-dom'
import type { Answers, Coords, Puzzle } from '../../models/models'
import styles from './Game.module.scss'
import Crossword from '../Crossword/Crossword'
import { useEffect, useRef, useState } from 'react'
import Controls from '../Controls/Controls'
import { hasThreeLetterWords, isGameCompleted } from '../../utils/utils'

type Props = {
  puzzle: Puzzle
  answersFromLocal: Answers
  puzzlesLength: number
}

export type Message = {
  type: 'alreadyFound' | 'alreadyFoundBonus' | 'no3Letter'
  text: string
}

export type AnimatedTilesDef = { name: string; coords: Coords[] }

export default function Game({
  puzzle,
  answersFromLocal,
  puzzlesLength,
}: Props) {
  const [answers, setAnswers] = useState<Answers>(
    answersFromLocal ?? {
      words: [],
      bonusWords: [],
    }
  )
  const [animatedTiles, setAnimatedTiles] = useState<AnimatedTilesDef | null>(
    null
  )

  const [message, setMessage] = useState<Message | null>(null)

  const { level } = puzzle

  const allowThreeLetterWords = hasThreeLetterWords(puzzle)

  const handleAnswer = (text: string) => {
    text = text.toUpperCase().trim()

    if (!allowThreeLetterWords && text.length === 3) {
      setMessage({ type: 'no3Letter', text: 'No 3-letter words' })
      return
    }

    if (answers.words.includes(text)) {
      setMessage({ type: 'alreadyFound', text: 'Already found' })
      setAnimatedTiles({ name: 'pulse-purple', coords: puzzle.solutions[text] })
      return
    }

    if (answers.bonusWords.includes(text)) {
      setMessage({ type: 'alreadyFoundBonus', text: 'Already found' })
      return
    }

    if (puzzle.bonusWords.includes(text)) {
      const newAnswers: Answers = {
        ...answers,
        bonusWords: [...answers.bonusWords, text],
      }
      setAnswers(newAnswers)
      localStorage.setItem(
        `wordscapes-state-${level}`,
        JSON.stringify(newAnswers)
      )
      return
    }

    if (Object.keys(puzzle.solutions).includes(text)) {
      setAnimatedTiles({ name: 'pulse-green', coords: puzzle.solutions[text] })
      const newAnswers: Answers = {
        ...answers,
        words: [...answers.words, text],
      }
      setAnswers(newAnswers)
      localStorage.setItem(
        `wordscapes-state-${level}`,
        JSON.stringify(newAnswers)
      )
      return
    }
  }

  const reset = () => {
    setAnswers({ bonusWords: [], words: [], hintsUsed: [] })
    localStorage.removeItem(`wordscapes-state-${level}`)
  }

  const gameComplete = isGameCompleted(puzzle, answers)
  const prevGameCompleteRef = useRef(gameComplete)

  useEffect(() => {
    if (!prevGameCompleteRef.current && gameComplete) {
      jsConfetti.addConfetti()
    }

    prevGameCompleteRef.current = gameComplete
  }, [gameComplete])

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
        <Crossword
          answers={answers}
          puzzle={puzzle}
          animatedTiles={animatedTiles}
        ></Crossword>

        <Controls
          disabled={gameComplete}
          puzzle={puzzle}
          handleAnswer={handleAnswer}
          message={message}
          setMessage={setMessage}
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
