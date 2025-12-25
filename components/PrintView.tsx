
import React from 'react';
import { Flashcard } from '../types';
import { ChessBoard } from './ChessBoard';

interface PrintViewProps {
  flashcards: Flashcard[];
}

export const PrintView: React.FC<PrintViewProps> = ({ flashcards }) => {
  // Chunk into sets of 3
  const chunks: Flashcard[][] = [];
  for (let i = 0; i < flashcards.length; i += 3) {
    chunks.push(flashcards.slice(i, i + 3));
  }

  return (
    <div className="print-only bg-white">
      {chunks.map((chunk, chunkIdx) => (
        <React.Fragment key={chunkIdx}>
          {/* Page of Fronts */}
          <div className="h-[279.4mm] w-[215.9mm] flex flex-col page-break border-0 box-border">
            {chunk.map((card, idx) => (
              <div key={`front-${card.card_id}`} className={`flex-1 ${idx < chunk.length - 1 ? 'border-b border-gray-300' : ''} p-12 flex flex-col justify-center items-center text-center relative box-border overflow-hidden`}>
                <div className="absolute top-8 left-8 flex items-center space-x-2">
                   <span className="text-[10px] font-bold text-slate-400 border border-slate-300 px-2 py-0.5 rounded">MOVE {card.back_content.move_number}</span>
                </div>
                <span className="text-sm text-gray-400 mb-4 font-mono uppercase tracking-widest">Front of Card #{card.card_id}</span>
                <h2 className="text-2xl font-serif italic text-slate-800 leading-relaxed max-w-lg">
                  "{card.front_content.comment_text}"
                </h2>
              </div>
            ))}
          </div>

          {/* Page of Backs */}
          <div className="h-[279.4mm] w-[215.9mm] flex flex-col page-break border-0 box-border bg-slate-50">
            {chunk.map((card, idx) => (
              <div key={`back-${card.card_id}`} className={`flex-1 ${idx < chunk.length - 1 ? 'border-b border-gray-300' : ''} p-8 flex items-center justify-between box-border overflow-hidden`}>
                {/* Back Left: Variations */}
                <div className="w-1/2 pr-8 border-r border-slate-200 h-full flex flex-col justify-center">
                   <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Variations / Alternatives</h3>
                   <div className="text-sm font-mono text-slate-700 leading-tight bg-white p-4 rounded border border-slate-100 shadow-sm min-h-[100px] flex items-center">
                     {card.back_content.variations_text || "No variations recorded for this position."}
                   </div>
                </div>
                {/* Back Right: Position */}
                <div className="w-1/2 pl-8 flex flex-col items-center justify-center">
                   <div className="w-full flex justify-between items-center mb-4">
                     <h3 className="text-xs uppercase font-bold text-slate-500">Position Summary</h3>
                     <span className="text-[10px] font-bold text-slate-900 bg-slate-200 px-2 py-1 rounded uppercase">
                       {card.back_content.player_to_move}'s Turn
                     </span>
                   </div>
                   <ChessBoard fen={card.back_content.position_fen} size={200} />
                   <p className="mt-4 text-[10px] text-slate-400 font-mono truncate max-w-full">
                     {card.back_content.position_fen}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
