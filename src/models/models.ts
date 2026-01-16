export interface ApiResponse {
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

export interface Puzzle {
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

export type Coords = [number, number]

export type Answers = {
  words: string[]
  bonusWords: string[]
}

export type LoaderData = {
  puzzle: Puzzle
  puzzlesLength: number
  answersFromLocal: Answers
}
