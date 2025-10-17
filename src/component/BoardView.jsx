// src/BoardView.jsx
import React from 'react';

const tileColor = (v) => {
  if (v === 0) return '#cdc1b4';
  const map = {
    2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',
    32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',
    512:'#edc850',1024:'#edc53f',2048:'#edc22e'
  };
  return map[v] || '#3c3a32';
};

export default function BoardView({ board }) {
  const size = board.length;
  const tileSize = Math.max(60, 320 / size);

  return (
    <div style={{
      background: '#bbada0',
      padding: 10,
      borderRadius: 6,
      display: 'grid',
      gridTemplateRows: `repeat(${size}, ${tileSize}px)`,
      gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
      gap: 8
    }}>
      {board.flat().map((v, idx) => (
        <div key={idx} style={{
          width: tileSize,
          height: tileSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tileColor(v),
          borderRadius: 4,
          fontSize: v > 999 ? 14 : 18,
          fontWeight: 700,
          color: v > 4 ? '#f9f6f2' : '#776e65'
        }}>
          {v !== 0 ? v : ''}
        </div>
      ))}
    </div>
  );
}
