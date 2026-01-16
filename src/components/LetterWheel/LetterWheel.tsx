import {
  useEffect,
  useState,
  type CSSProperties,
  type Dispatch,
  type PointerEvent,
  type ReactNode,
  type SetStateAction,
} from 'react'
import styles from './LetterWheel.module.scss'
import { type Coords } from '../../models/models.ts'

const getStrokeWidth = (count: number) => {
  let strokeWidth = 18

  if (count > 4) {
    strokeWidth = 16
  }

  if (count > 5) {
    strokeWidth = 14
  }

  if (count > 6) {
    strokeWidth = 6
  }

  return strokeWidth
}

const getLetterWidth = (count: number) => {
  let letterWidth = 68

  if (count > 4) {
    letterWidth -= 4
  }

  if (count > 5) {
    letterWidth -= 4
  }

  if (count > 6) {
    letterWidth -= 4
  }

  return letterWidth
}

// const getLetterOffset = (count: number) => {
//   let offset =
// }

type Props = {
  letters: string
  //eslint-disable-next-line
  handleAnswer: (str: string) => void
  setCurrentText: Dispatch<SetStateAction<string>>
}

type Connector = {
  coords: Coords
  char: string
  key: number
}

export default function LetterWheel({
  letters = '',
  handleAnswer,
  setCurrentText,
}: Props) {
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [draggingConnector, setDraggingConnector] = useState<Coords | null>(
    null
  )

  const width = 240

  const arr = letters.split('')

  const letterWidth = getLetterWidth(arr.length)
  const strokeWidth = getStrokeWidth(arr.length)

  const onPointerMove = (e: PointerEvent) => {
    const { clientX, clientY } = e
    const target = e.currentTarget as HTMLDivElement
    const { left, top } = target.getBoundingClientRect()

    const offsetX = clientX - left
    const offsetY = clientY - top

    if (!connectors.length) return

    setDraggingConnector([offsetX, offsetY])
  }

  const onPointerDown = (e: PointerEvent, char: string, key: number) => {
    const target = e.target as HTMLDivElement
    const parent = target.parentElement as HTMLDivElement
    const parentRect = parent.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    const { x, y, width, height } = rect
    setConnectors((prev) => [
      ...prev,
      {
        char,
        key,
        coords: [
          x - parentRect.x + 0.5 * width,
          y - parentRect.y + 0.5 * height,
        ],
      },
    ])
  }

  const onPointerEnter = (e: PointerEvent, char: string, key: number) => {
    if (!connectors.length) return
    const target = e.target as HTMLDivElement
    const parent = target.parentElement as HTMLDivElement
    const parentRect = parent.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    const { x, y, width, height } = rect

    const resX = x - parentRect.left + 0.5 * width
    const resY = y - parentRect.top + 0.5 * height

    const alreadyInArray = connectors.findIndex((c) => c.key === key)
    if (alreadyInArray > -1) {
      setConnectors((prev) => [
        ...prev.slice(0, alreadyInArray),
        { char, key, coords: [resX, resY] },
      ])
    } else {
      setConnectors((prev) => [...prev, { char, key, coords: [resX, resY] }])
    }

    e.stopPropagation()
  }

  const renderConnectors = (connectors: Connector[]): ReactNode[] => {
    const res: ReactNode[] = []

    let i = 1
    while (i < connectors.length) {
      if (!connectors[i - 1]) return []
      const [prevX, prevY] = connectors[i - 1].coords
      const [x, y] = connectors[i].coords
      res.push(
        <path
          key={i}
          className={styles.connector}
          d={`M ${prevX} ${prevY} L ${x} ${y}`}
          strokeWidth={strokeWidth}
        ></path>
      )
      i++
    }

    if (connectors.length && draggingConnector) {
      res.push(
        <path
          key={i}
          className={styles.connector}
          d={`M ${draggingConnector[0]} ${draggingConnector[1]} L ${
            connectors.at(-1)!.coords[0]
          } ${connectors.at(-1)!.coords[1]}`}
          style={{ strokeWidth }}
        ></path>
      )
    }

    return res
  }

  useEffect(() => {
    const listener = () => {
      handleAnswer(connectors.map((c) => c.char).join(''))
      setConnectors([])
      setDraggingConnector(null)
    }

    window.addEventListener('pointerup', listener)

    return () => window.removeEventListener('pointerup', listener)
  }, [])

  useEffect(() => {
    setCurrentText(connectors.map((c) => c.char).join(''))
  }, [connectors])

  return (
    <div
      className={styles.letterWheel}
      style={{
        width: width + 'px',
        height: width + 'px',
      }}
      onPointerUp={() => {
        handleAnswer(connectors.map((c) => c.char).join(''))
        setConnectors([])
        setDraggingConnector(null)
      }}
      onPointerMove={onPointerMove}
    >
      {arr.map((char, idx) => {
        const angle = (360 / arr.length) * idx

        const connected = connectors.findIndex(({ key }) => key === idx) > -1

        const connectedStyles: CSSProperties = connected
          ? {
              backgroundColor: 'var(--letter-bg)',
              color: 'var(--letter-color)',
            }
          : {}

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
                `translate(0px, -${width / 2 - letterWidth / 2 - 8}px)`,
                `rotate(${-angle}deg)`,
              ].join(' '),
              ...connectedStyles,
            }}
            onPointerDown={(e) => onPointerDown(e, char, idx)}
            onPointerEnter={(e) => onPointerEnter(e, char, idx)}
            onGotPointerCapture={(e) => {
              const target = e.target as HTMLDivElement
              target.releasePointerCapture(e.pointerId)
            }}
          >
            {char}
          </div>
        )
      })}
      <svg viewBox={`0 0 ${width} ${width}`} className={styles.svg}>
        {...renderConnectors(connectors)}
      </svg>
    </div>
  )
}
