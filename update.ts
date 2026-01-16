// import fs from 'fs'
// import puzzlesArr from './puzzles.json' with { type: 'json' }
// import { type ApiResponse, type Puzzle } from './src/models/models.ts'
// import { buildSolutions } from './src/utils/utils.ts'

// const puzzles = puzzlesArr as unknown as Puzzle[]

// const getGame = async (level: number) => {
//   try {
//     const response = await fetch(
//       'https://api.yourdictionary.com/wordfinder/v3/wordscapes?level=' + level
//     )
//     const res: ApiResponse = await response.json()

//     if (res.status === 200 && res.data && !res.errors) {
//       const { data } = res
//       const { _items: items } = data

//       puzzles.push({
//         letters: items.letters,
//         world: items.world,
//         stage: items.stage,
//         bonusWords: items.bonus_words,
//         board: {
//           width: items.board.width,
//           height: items.board.height,
//           rows: items.board.rows,
//         },
//         solutions: buildSolutions(items.words, items.board.rows),
//         level,
//       })

//       fs.writeFileSync('puzzles2.json', JSON.stringify(puzzles, null, 2))
//     }
//   } catch {
//     console.error('Failed to fetch level:' + level)
//     return
//   }
// }

// const getGames = async (start: number, end: number) => {
//   let i = start
//   while(i <= end) {
//     await getGame(i)
//     i++
//   }
// }

// getGames(1, 1000)

// // const withSolutions = puzzles.map((p) => ({
// //   ...p,
// //   solutions: buildSolutions(Object.keys(p.solutions), p.board.rows),
// // }))

// // fs.writeFileSync('puzzles2.json', JSON.stringify(withSolutions, null, 2))
