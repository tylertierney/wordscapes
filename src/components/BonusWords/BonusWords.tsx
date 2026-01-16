import styles from './BonusWords.module.scss'

type Props = {
  bonusWords: string[]
}

export default function BonusWords({ bonusWords }: Props) {
  return (
    <div className={styles.bonusWords}>
      <h2 className={styles.h2}>Bonus Words</h2>
      <span className={styles.subheader}>
        Words found that aren't in the puzzle
      </span>
      <div
        className={styles.wordsContainer}
        style={{
          gridTemplateRows: `repeate(${~~(bonusWords.length / 3)}, 1fr)`,
        }}
      >
        {bonusWords.map((str, idx) => (
          <div key={idx} className={styles.word}>
            {str}
          </div>
        ))}
      </div>
    </div>
  )
}
