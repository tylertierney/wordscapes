import styles from './LetterWheel.module.scss'

type Props = {
  letters: string
}

export default function LetterWheel({ letters = '' }: Props) {
  const arr = letters.split('')

  let letterWidth = 56

  if (arr.length > 4) {
    letterWidth = 52
  }

  if (arr.length > 5) {
    letterWidth = 48
  }

  return (
    <div className={styles.letterWheel}>
      {arr.map((char, idx) => {
        const angle = (360 / arr.length) * idx

        return (
          <div
            key={idx}
            className={styles.letter}
            style={{
              width: letterWidth + 'px',
              height: letterWidth + 'px',
              margin: -0.5 * letterWidth + 'px',
              transform: [
                `rotate(${angle}deg)`,
                `translate(0px, -${60}px)`,
                `rotate(${-angle}deg)`,
              ].join(' '),
            }}
          >
            {char}
          </div>
        )
      })}
    </div>
  )
}
