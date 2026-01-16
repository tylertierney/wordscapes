import styles from './Controls.module.scss'
import {
  useEffect,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { type Answers, type Puzzle } from '../../models/models.ts'
import Button from '../Button/Button'
import LetterWheel from '../LetterWheel/LetterWheel'
import { getHint, shuffleArray } from '../../utils/utils'
import { shuffleIcon } from '../../svg/shuffle.tsx'
import { lightbulbIcon } from '../../svg/lightbulb.tsx'
import { starIcon } from '../../svg/star.tsx'
import Modal from '../Modal/Modal'
import BonusWords from '../BonusWords/BonusWords.tsx'

type Props = {
  puzzle: Puzzle
  handleAnswer: (str: string) => void
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
  style?: CSSProperties
}

export default function Controls({
  puzzle,
  handleAnswer,
  answers,
  setAnswers,
  style = {},
}: Props) {
  const [letters, setLetters] = useState('')
  const [currentText, setCurrentText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setLetters(puzzle.letters)
  }, [puzzle])

  const handleHint = (answers: Answers) => {
    const hint = getHint(puzzle, answers)
    const newAnswers: Answers = {
      ...answers,
      hintsUsed: [...answers.hintsUsed, hint],
    }
    setAnswers(newAnswers)
  }

  const availableHints = Math.max(
    answers.bonusWords.length - answers.hintsUsed.length,
    0
  )

  return (
    <>
      <div className={styles.controls} style={style}>
        <div className={styles.letters}>{currentText}</div>
        <div className={styles.controlsBottom}>
          <div className={styles.leftButtons}>
            <Button
              disabled={availableHints < 1}
              className={styles.smallButton}
              onClick={() => handleHint(answers)}
            >
              {lightbulbIcon}
              {availableHints > 0 ? (
                <div className={styles.indicator}>{availableHints}</div>
              ) : (
                ''
              )}
            </Button>
            <Button
              className={styles.smallButton}
              onClick={() =>
                setLetters((prev) => shuffleArray(prev.split('')).join(''))
              }
            >
              {shuffleIcon}
            </Button>
          </div>
          <LetterWheel
            setCurrentText={setCurrentText}
            handleAnswer={handleAnswer}
            letters={letters}
          />
          <Button
            className={styles.smallButton}
            onClick={() => setModalOpen(true)}
          >
            {starIcon}
          </Button>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <BonusWords bonusWords={answers.bonusWords} />
      </Modal>
    </>
  )
}
