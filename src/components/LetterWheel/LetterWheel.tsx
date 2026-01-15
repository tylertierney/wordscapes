import { useState, type PointerEvent, type ReactNode } from 'react'
import styles from './LetterWheel.module.scss'
import { type Coords } from '../../models/models.ts'

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

type Props = {
  letters: string
}

export default function LetterWheel({ letters = '' }: Props) {
  const [connectors, setConnectors] = useState<Coords[]>([])
  const [draggingConnector, setDraggingConnector] = useState<Coords>([])

  const width = 240

  const arr = letters.split('')

  const letterWidth = getLetterWidth(arr.length)

  const onPointerMove = (e: PointerEvent) => {
    const { clientX, clientY } = e
    const target = e.currentTarget as HTMLDivElement
    const { left, top } = target.getBoundingClientRect()

    const offsetX = clientX - left
    const offsetY = clientY - top

    if (!connectors.length) return

    // setConnectors((prev) => {
    //   if (prev.length < 2) {
    //     return [prev[0], [offsetX, offsetY]]
    //   }

    //   return [...prev.slice(0, prev.length - 1), [offsetX, offsetY]]
    // })

    setDraggingConnector([offsetX, offsetY])
  }

  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLDivElement
    const parent = target.parentElement as HTMLDivElement
    const parentRect = parent.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    const { x, y, width, height } = rect
    setConnectors((prev) => [
      ...prev,
      [x - parentRect.x + 0.5 * width, y - parentRect.y + 0.5 * height],
    ])
  }

  // const onPointerEnter = (e: PointerEvent) => {
  //   if (!connectors.length) return
  //   const target = e.target as HTMLDivElement
  //   const parent = target.parentElement as HTMLDivElement
  //   const parentRect = parent.getBoundingClientRect()
  //   const rect = target.getBoundingClientRect()
  //   const { x, y, width, height } = rect
  //   setConnectors((prev) => [
  //     ...prev,
  //     [x - parentRect.left + 0.5 * width, y - parentRect.top + 0.5 * height],
  //   ])
  // }

  const onPointerEnter = (e: PointerEvent) => {
    if (!connectors.length) return
    const target = e.target as HTMLDivElement
    const parent = target.parentElement as HTMLDivElement
    const parentRect = parent.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    const { x, y, width, height } = rect

    const resX = x - parentRect.left + 0.5 * width
    const resY = y - parentRect.top + 0.5 * height
    console.log({ resX, resY })
    setConnectors((prev) => [...prev, [resX, resY]])

    e.stopPropagation()
  }

  // console.log(connectors)

  const renderConnectors = (connectors: Coords[]): ReactNode[] => {
    const res: ReactNode[] = []

    let i = 1
    while (i < connectors.length) {
      if (!connectors[i - 1]) return []
      const [prevX, prevY] = connectors[i - 1]
      const [x, y] = connectors[i]
      res.push(
        <path
          key={i}
          className={styles.connector}
          d={`M ${prevX} ${prevY} L ${x} ${y}`}
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
            connectors.at(-1)![0]
          } ${connectors.at(-1)![1]}`}
        ></path>
      )
    }

    return res
  }

  return (
    <div
      className={styles.letterWheel}
      style={{
        width: width + 'px',
        height: width + 'px',
      }}
      onPointerUp={() => {
        setConnectors([])
      }}
      onPointerMove={onPointerMove}
    >
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
                `translate(0px, -${width / 2 - letterWidth / 2 - 10}px)`,
                `rotate(${-angle}deg)`,
              ].join(' '),
            }}
            onPointerDown={onPointerDown}
            onPointerEnter={onPointerEnter}
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
