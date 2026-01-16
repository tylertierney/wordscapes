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
import { starIcon } from '../../svg/star.tsx'
import Modal from '../Modal/Modal'
import BonusWords from '../BonusWords/BonusWords.tsx'
import HintButton from './HintButton/HintButton.tsx'
import type { Message } from '../Game/Game.tsx'

type Props = {
  puzzle: Puzzle
  handleAnswer: (str: string) => void
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
  message: Message | null
  setMessage: Dispatch<SetStateAction<Message | null>>
  disabled?: boolean
  style?: CSSProperties
}

const getMessageColor = (message: Message): CSSProperties['color'] => {
  if (message.type === 'alreadyFound') {
    return 'purple'
  }

  if (message.type === 'alreadyFoundBonus') {
    return 'purple'
  }

  return 'var(--error-red)'
}

export default function Controls({
  puzzle,
  handleAnswer,
  answers,
  setAnswers,
  disabled = false,
  message,
  setMessage,
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
    localStorage.setItem(
      `wordscapes-state-${puzzle.level}`,
      JSON.stringify(newAnswers)
    )
    setAnswers(newAnswers)
  }

  const availableHints = Math.max(
    answers.bonusWords.length - answers.hintsUsed.length,
    0
  )

  return (
    <>
      <div className={styles.controls} style={style}>
        <div className={styles.letters}>
          {message ? (
            <span
              className={styles.message}
              style={{
                color: getMessageColor(message),
                animationName: 'fadeout',
                animationDuration: '1000ms',
                animationFillMode: 'forwards',
                animationTimingFunction: 'ease-in-out',
                // animationIterationCount: 'infinite',
                fontSize: '30px',
              }}
              onAnimationEnd={() => setMessage(null)}
            >
              {message.text}
            </span>
          ) : (
            currentText
          )}
        </div>
        <div className={styles.controlsBottom}>
          <div className={styles.leftButtons}>
            <HintButton
              availableHints={availableHints}
              answers={answers}
              handleHint={handleHint}
              disabled={disabled}
              className={styles.smallButton}
            />
            <Button
              className={styles.smallButton}
              disabled={disabled}
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
            disabled={disabled}
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
