import styles from './HintButton.module.scss'
import { lightbulbIcon } from '../../../svg/lightbulb'
import Button from '../../Button/Button'
import type { Answers } from '../../../models/models'
import { useEffect, useRef, useState } from 'react'

type Props = {
  availableHints: number
  answers: Answers
  handleHint: (answers: Answers) => void
  disabled: boolean
  className?: string
}

export default function HintButton({
  availableHints = 0,
  answers,
  handleHint,
  disabled,
  className = '',
}: Props) {
  const prevHintsRef = useRef(availableHints)
  const [hintPulseKey, setHintPulseKey] = useState<number | null>(null)

  useEffect(() => {
    if (availableHints > prevHintsRef.current) {
      // trigger animation
      setHintPulseKey(Date.now())
    }
    prevHintsRef.current = availableHints
  }, [availableHints])

  return (
    <Button
      disabled={availableHints < 1 || disabled}
      className={`${className} ${styles.hintButton}`}
      onClick={() => handleHint(answers)}
    >
      {lightbulbIcon}
      {availableHints > 0 ? (
        <div className={styles.indicator}>{availableHints}</div>
      ) : (
        ''
      )}
      {hintPulseKey && (
        <span
          key={hintPulseKey}
          className={styles.hintDiff}
          onAnimationEnd={() => setHintPulseKey(null)}
        >
          +1
        </span>
      )}
    </Button>
  )
}
