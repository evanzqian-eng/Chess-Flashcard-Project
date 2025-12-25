
import React from 'react';

export const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

export const SAMPLE_PGN = `[Event "Fictional Game"]

e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This is the Ruy Lopez exchange variation setup, though usually White takes on c6 here.} 4. Ba4 Nf6 5. O-O (5. Qe2 b5 6. Bb3 Be7) 5... Be7 {Black develops solidly.} 6. Re1 b5 7. Bb3 d6 8. c3 O-O {A very standard position. White plans d4.}`;
