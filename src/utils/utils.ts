import type { Answers, Coords, Puzzle } from '../models/models'

// export function buildSolutions(
//   puzzle: ApiResponse['data']['_items']
// ): Record<string, Coords[]> {
//   const res: Record<string, Coords[]> = {}

//   const words = puzzle.words
//   const origRows = puzzle.board.rows

//   const rows = origRows.map((row) => row.split(','))

//   for (let r = 0; r < rows.length; r++) {
//     for (let c = 0; c < rows[r].length; c++) {
//       const char = rows[r][c]

//       if (char !== '·') {
//         let currentWord = ''
//         let coords: Coords[] = []

//         let i = r
//         while (i < rows.length && rows[i][c] !== '·') {
//           coords.push([i, c])
//           currentWord += rows[i][c]
//           i++
//         }

//         if (words.includes(currentWord)) {
//           res[currentWord] = [...coords]
//         }

//         currentWord = ''
//         coords = []

//         ////////////

//         let j = c
//         while (j < rows[r].length && rows[r][j] !== '·') {
//           coords.push([r, j])
//           currentWord += rows[r][j]
//           j++
//         }

//         if (words.includes(currentWord)) {
//           res[currentWord] = [...coords]
//         }
//       }
//     }
//   }

//   return res
// }

export function buildSolutions(
  words: string[],
  origRows: string[]
): Record<string, Coords[]> {
  const res: Record<string, Coords[]> = {}

  const rows = origRows.map((row) => row.split(','))

  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const char = rows[r][c]

      if (char !== '·') {
        let currentWord = ''
        let coords: Coords[] = []

        if (r === 0 || rows[r - 1][c] === '·') {
          let i = r
          while (i < rows.length && rows[i][c] !== '·') {
            coords.push([i, c])
            currentWord += rows[i][c]
            i++
          }

          if (words.includes(currentWord)) {
            res[currentWord] = [...coords]
          }
        }

        currentWord = ''
        coords = []

        ////////////

        if (c === 0 || rows[r][c - 1] === '·') {
          let j = c
          while (j < rows[r].length && rows[r][j] !== '·') {
            coords.push([r, j])
            currentWord += rows[r][j]
            j++
          }

          if (words.includes(currentWord)) {
            res[currentWord] = [...coords]
          }
        }
      }
    }
  }

  return res
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  let i = 0
  while (i < arr.length) {
    const randomSpot = ~~(Math.random() * arr.length)
    ;[arr[i], arr[randomSpot]] = [arr[randomSpot], arr[i]]
    i++
  }
  return arr
}

export const getAnswersFromLocalStorage = (p: Puzzle): Answers | null => {
  const fromLocalStorage = localStorage.getItem(
    `wordscapes-state-${String(p.level)}`
  )
  if (!fromLocalStorage) {
    return null
  }
  return JSON.parse(fromLocalStorage) as Answers
}

export const isGameCompleted = (p: Puzzle, answers: Answers) => {
  let res = [...Object.keys(p.solutions)]
  for (const word of answers.words) {
    res = res.filter((str) => str !== word)
  }

  return res.length === 0
}

export const isGameInProgress = (answers: Answers): boolean => {
  return Boolean(answers.words.length) || Boolean(answers.bonusWords.length)
}

export const getHint = (puzzle: Puzzle, answers: Answers): any => {
  const revealedTiles = [
    ...Object.entries(puzzle.solutions)
      .filter(([word]) => answers.words.includes(word))
      .flatMap((both) => both[1]),
    ...answers.hintsUsed,
  ]

  const origRows = puzzle.board.rows
  const rows = origRows.map((str) => str.split(','))

  const remainingTiles: Coords[] = []

  let r = 0
  while (r < rows.length) {
    let c = 0
    while (c < rows[r].length) {
      if (rows[r][c] !== '·') {
        if (revealedTiles.findIndex(([x, y]) => x === r && y === c) < 0) {
          remainingTiles.push([r, c])
        }
      }
      c++
    }
    r++
  }

  return remainingTiles[~~(Math.random() * remainingTiles.length)]
}
