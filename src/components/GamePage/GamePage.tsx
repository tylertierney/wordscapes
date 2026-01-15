import { toast } from 'react-toastify'
import { useLoaderData } from 'react-router-dom'
import type { Answers, Puzzle } from '../../models/models'
import styles from './GamePage.module.scss'
import Crossword from '../Crossword/Crossword'
import { useState } from 'react'
import LetterWheel from '../LetterWheel/LetterWheel'

export default function GamePage() {
  const [currentText, setCurrentText] = useState('')
  const [answers, setAnswers] = useState<Answers>({
    words: ['DOLE', 'LOVED'],
    bonusWords: [],
  })

  const puzzle = useLoaderData() as Puzzle

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

    setCurrentText('')
  }

  return (
    <div className={styles.gamePage}>
      <p style={{ minHeight: '3rem' }}>{currentText}</p>

      <Crossword answers={answers} puzzle={puzzle}></Crossword>

      <div style={{ alignSelf: 'center' }}>
        <p>Letters:</p>
        <p>{puzzle.letters.split('').map((char) => char + ' ')}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAnswer(currentText)
          }}
        >
          <input
            value={currentText}
            type="text"
            onChange={(e) => setCurrentText(e.target.value)}
          />
        </form>
      </div>
      <LetterWheel letters={puzzle.letters} />
    </div>
  )
}
