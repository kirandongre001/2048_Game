// src/Controls.jsx
import React from 'react';

export default function Controls({ onMove, onRestart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button onClick={() => onMove('up')}>↑</button>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => onMove('left')}>←</button>
        <button onClick={() => onMove('right')}>→</button>
      </div>
      <button onClick={() => onMove('down')}>↓</button>
      <button onClick={onRestart} style={{ marginTop: 10 }}>Restart</button>
    </div>
  );
}
