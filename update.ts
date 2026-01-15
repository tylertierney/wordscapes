import fs from 'fs'
import puzzlesArr from './puzzles2.json' with {type: 'json'}

type Coords = [number, number]

type ApiResponse = {
  status: number
  message: string
  errors: unknown
  data: {
    _items: {
      letters: string
      world: string
      stage: string
      words: string[]
      words_def: number[]
      bonus_words: string[]
      bonus_words_def: number[]
      board_display: boolean
      board: {
        width: number
        height: number
        rows: string[]
      }
    }
    _meta: {
      level: string
    }
    _info: {
      maxLevels: number
    }
  }
}

type Puzzle = {
  letters: string
  world: string
  stage: string
  bonusWords: string[]
  board: {
    width: number
    height: number
    rows: string[]
  }
  level: number
  solutions: Record<string, Coords[]>
}

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

const puzzles = puzzlesArr as unknown as Puzzle[]

const getGame = async (level: number) => {
  try {
    const response = await fetch(
      'https://api.yourdictionary.com/wordfinder/v3/wordscapes?level=' + level
    )
    const res: ApiResponse = await response.json()

    if (res.status === 200 && res.data && !res.errors) {
      const { data } = res
      const { _items: items } = data

      puzzles.push({
        letters: items.letters,
        world: items.world,
        stage: items.stage,
        bonusWords: items.bonus_words,
        board: {
          width: items.board.width,
          height: items.board.height,
          rows: items.board.rows,
        },
        solutions: buildSolutions(items),
        level,
      })

      fs.writeFileSync('puzzles2.json', JSON.stringify(puzzles, null, 2))
    }
  } catch {
    console.error('Failed to fetch level:' + level)
    return
  }
}

const getGames = async (start: number, end: number) => {
  let i = start
  while(i <= end) {
    await getGame(i)
    i++
  }
}

getGames(1, 1000)
