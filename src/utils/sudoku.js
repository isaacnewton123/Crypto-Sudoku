// src/utils/sudoku.js
export function generateSudoku(difficulty = 'medium') {
  const emptyBoard = Array(9).fill().map(() => Array(9).fill(0))
  const solvedBoard = solveSudoku(emptyBoard)
  const puzzleBoard = createPuzzle(solvedBoard, difficulty)
  return { board: puzzleBoard, solution: solvedBoard }
}

function solveSudoku(board) {
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])
  
  function solve(row, col) {
    if (col === 9) {
      row++
      col = 0
    }
    if (row === 9) return true
    if (board[row][col] !== 0) return solve(row, col + 1)
    
    for (const num of numbers) {
      if (isValidMove(board, row, col, num)) {
        board[row][col] = num
        if (solve(row, col + 1)) return true
        board[row][col] = 0
      }
    }
    return false
  }
  
  solve(0, 0)
  return JSON.parse(JSON.stringify(board))
}

function createPuzzle(solvedBoard, difficulty) {
  const puzzle = JSON.parse(JSON.stringify(solvedBoard))
  const cellsToRemove = {
    'easy': 30,
    'medium': 45,
    'hard': 55
  }[difficulty]
  
  let removed = 0
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0
      removed++
    }
  }
  return puzzle
}

function isValidMove(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false
    }
  }
  
  return true
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}