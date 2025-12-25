
import React from 'react';
import { PIECE_SYMBOLS } from '../constants';

interface ChessBoardProps {
  fen: string;
  size?: number;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ fen, size = 200 }) => {
  const rows = fen.split(' ')[0].split('/');
  const board: (string | null)[][] = rows.map(row => {
    const rowArr: (string | null)[] = [];
    for (const char of row) {
      if (isNaN(parseInt(char))) {
        rowArr.push(char);
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          rowArr.push(null);
        }
      }
    }
    return rowArr;
  });

  const cellSize = size / 8;

  return (
    <div className="border-4 border-slate-800 shadow-md inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {board.map((row, rIdx) => 
          row.map((piece, cIdx) => {
            const isDark = (rIdx + cIdx) % 2 === 1;
            return (
              <React.Fragment key={`${rIdx}-${cIdx}`}>
                <rect
                  x={cIdx * cellSize}
                  y={rIdx * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={isDark ? '#B58863' : '#F0D9B5'}
                />
                {piece && (
                  <text
                    x={cIdx * cellSize + cellSize / 2}
                    y={rIdx * cellSize + cellSize / 2}
                    dominantBaseline="central"
                    textAnchor="middle"
                    fontSize={cellSize * 0.8}
                    fill={piece === piece.toUpperCase() ? 'white' : 'black'}
                    style={{ textShadow: '0px 0px 2px rgba(0,0,0,0.5)', cursor: 'default' }}
                  >
                    {PIECE_SYMBOLS[piece] || piece}
                  </text>
                )}
              </React.Fragment>
            );
          })
        )}
      </svg>
    </div>
  );
};
