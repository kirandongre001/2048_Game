// src/App.jsx
import React, { useEffect, useReducer } from 'react';
import {
  startBoard, move, spawnRandomTile, hasMoves, isWin
} from './utils/boardLogic';
import BoardView from './component/BoardView';
import Controls from './component/Controls';

const initialSize = 4;

const initialState = {
  board: startBoard(initialSize),
  score: 0,
  size: initialSize,
  gameOver: false,
  won: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'RESET': {
      const size = action.size ?? state.size;
      return {
        board: startBoard(size),
        score: 0,
        size,
        gameOver: false,
        won: false
      };
    }
    case 'MOVE': {
      if (state.gameOver) return state;
      const { direction } = action;
      const res = move(state.board, direction);
      if (!res.moved) return state; // no change

      let newBoard = spawnRandomTile(res.board);
      const newScore = state.score + res.scoreGained;
      const won = isWin(newBoard);
      const over = !hasMoves(newBoard) || won;

      return {
        ...state,
        board: newBoard,
        score: newScore,
        gameOver: over,
        won: won
      };
    }
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleKey = (e) => {
      const keyMap = {
        ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
        a: 'left', d: 'right', w: 'up', s: 'down'
      };
      const dir = keyMap[e.key];
      if (dir) dispatch({ type: 'MOVE', direction: dir });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="app-container" style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>2048 (Functional)</h1>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div>
          <div>Score: <strong>{state.score}</strong></div>
          <div>Size:
            <select
              value={state.size}
              onChange={(e) => dispatch({ type: 'RESET', size: Number(e.target.value) })}
            >
              <option value={3}>3 x 3</option>
              <option value={4}>4 x 4</option>
              <option value={5}>5 x 5</option>
            </select>
          </div>
          <button onClick={() => dispatch({ type: 'RESET' })}>Restart</button>
        </div>

        <BoardView board={state.board} />

        <Controls
          onMove={(dir) => dispatch({ type: 'MOVE', direction: dir })}
          onRestart={() => dispatch({ type: 'RESET' })}
        />
      </div>

      {state.won && <div style={{ marginTop: 12, color: 'green' }}>You reached 2048! 🎉</div>}
      {state.gameOver && !state.won && <div style={{ marginTop: 12, color: 'red' }}>Game over — no moves left</div>}
      <div style={{ marginTop: 12, maxWidth: 600 }}>
        <p>Controls: Arrow keys or WASD. Click on directional buttons too.</p>
      </div>
    </div>
  );
}
