// src/boardLogic.js
// Pure functional implementations for 2048 mechanics.

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function createBoard(size = 4) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

export function cloneBoard(board) {
  return board.map(row => row.slice());
}

export function emptyCells(board) {
  const empties = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] === 0) empties.push([r, c]);
    }
  }
  return empties;
}

export function spawnRandomTile(board, probs = {2: 0.9, 4: 0.1}) {
  const empties = emptyCells(board);
  if (empties.length === 0) return board;
  const [r, c] = randomChoice(empties);
  const tile = Math.random() < probs[2] ? 2 : 4;
  const newBoard = cloneBoard(board);
  newBoard[r][c] = tile;
  return newBoard;
}

/* Helpers for move operations:
   We'll implement slideLeft on each row: compress -> merge -> compress
   For other directions, rotate the board so that move becomes left.
*/

function compressRow(row) {
  const newRow = row.filter(v => v !== 0);
  while (newRow.length < row.length) newRow.push(0);
  return newRow;
}

function mergeRow(row) {
  // merges adjacent equal tiles and returns [newRow, scoreGained]
  const res = row.slice();
  let score = 0;
  for (let i = 0; i < res.length - 1; i++) {
    if (res[i] !== 0 && res[i] === res[i + 1]) {
      res[i] = res[i] * 2;
      score += res[i];
      res[i + 1] = 0;
      i++; // skip next
    }
  }
  return [compressRow(res), score];
}

export function slideLeft(board) {
  const size = board.length;
  let moved = false;
  let totalScore = 0;
  const newBoard = board.map(row => {
    const compressed = compressRow(row);
    const [merged, score] = mergeRow(compressed);
    if (!moved && merged.some((val, idx) => val !== row[idx])) moved = true;
    totalScore += score;
    return merged;
  });
  return { board: newBoard, moved, scoreGained: totalScore };
}

// rotate clockwise n times
function rotate(board) {
  const n = board.length;
  const res = createBoard(n);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      res[c][n - 1 - r] = board[r][c];
    }
  }
  return res;
}

export function move(board, direction) {
  // direction: 'left' | 'right' | 'up' | 'down'
  // returns {board, moved, scoreGained}
  let working = cloneBoard(board);
  let rotatedTimes = 0;

  // normalize move to left by rotating
  if (direction === 'up') { working = rotate(working); rotatedTimes = 1; }
  else if (direction === 'right') { working = rotate(rotate(working)); rotatedTimes = 2; }
  else if (direction === 'down') { working = rotate(rotate(rotate(working))); rotatedTimes = 3; }
  // left => 0 rotations

  const { board: afterLeft, moved, scoreGained } = slideLeft(working);

  // rotate back
  let finalBoard = afterLeft;
  for (let i = 0; i < (4 - rotatedTimes) % 4; i++) finalBoard = rotate(finalBoard);

  return { board: finalBoard, moved, scoreGained };
}

export function hasMoves(board) {
  // if any empty cell, true
  const n = board.length;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (board[r][c] === 0) return true;
  // check merges possible horizontally or vertically
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n - 1; c++) {
      if (board[r][c] === board[r][c + 1]) return true;
    }
  }
  for (let c = 0; c < n; c++) {
    for (let r = 0; r < n - 1; r++) {
      if (board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

export function isWin(board, target = 2048) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] >= target) return true;
    }
  }
  return false;
}

// convenience to create starting board with two tiles
export function startBoard(size = 4) {
  let b = createBoard(size);
  b = spawnRandomTile(b);
  b = spawnRandomTile(b);
  return b;
}
