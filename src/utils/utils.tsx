import type { ApiResponse, Coords } from '../models/models'
import puzzlesArr from '../puzzles/puzzles.json'

export function buildSolutions(puzzle: ApiResponse['data']['_items']) {
  const res: Record<string, Coords[]> = {}

  const words = puzzle.words
  const origRows = puzzle.board.rows

  const rows = origRows.map((row) => row.split(','))

  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const char = rows[r][c]

      if (char !== '·') {
        let currentWord = ''
        let coords: Coords[] = []

        let i = r
        while (i < rows.length && rows[i][c] !== '·') {
          coords.push([i, c])
          currentWord += rows[i][c]
          i++
        }

        if (words.includes(currentWord)) {
          res[currentWord] = [...coords]
        }

        currentWord = ''
        coords = []

        ////////////

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

  return res
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.log(buildSolutions(puzzlesArr.at(-1) as unknown as any))
