
import React, { useState, useCallback, useRef } from 'react';
import { parsePgnToFlashcards } from './services/geminiService';
import { Flashcard } from './types';
import { SAMPLE_PGN } from './constants';
import { ChessBoard } from './components/ChessBoard';
import { PrintView } from './components/PrintView';
import { BookOpen, FileText, Layout, Printer, RefreshCcw, Loader2, Info, User, Upload, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [pgn, setPgn] = useState(SAMPLE_PGN);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleParse = async () => {
    if (!pgn.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await parsePgnToFlashcards(pgn);
      setFlashcards(results);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during parsing.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPgn(content);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(flashcards, null, 2));
    alert("JSON copied to clipboard!");
  };

  return (
    <div className="min-h-screen">
      {/* Web UI */}
      <div className="web-content">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Chess Flashcard Engine</h1>
                <p className="text-xs text-slate-500 font-medium">PGN to PDF Educational Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
               {flashcards.length > 0 && (
                 <button 
                  onClick={handlePrint}
                  className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors shadow-sm text-sm font-semibold"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
               )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <h2 className="font-semibold text-slate-800">PGN Input</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".pgn,text/plain"
                      className="hidden"
                    />
                    <button 
                      onClick={triggerFileUpload}
                      className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload PGN</span>
                    </button>
                    <button 
                      onClick={() => setPgn('')}
                      className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                      title="Clear Input"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full h-80 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                  placeholder="Paste your PGN data here or upload a file..."
                  value={pgn}
                  onChange={(e) => setPgn(e.target.value)}
                />
                <button
                  onClick={handleParse}
                  disabled={loading || !pgn.trim()}
                  className="w-full mt-4 bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-shadow shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Games...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-5 h-5" />
                      <span>Parse & Generate Flashcards</span>
                    </>
                  )}
                </button>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
                    {error}
                  </div>
                )}
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                 <div className="flex items-start space-x-3">
                   <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                   <div>
                     <h3 className="text-sm font-bold text-indigo-900 mb-1">How it works</h3>
                     <p className="text-xs text-indigo-700 leading-relaxed">
                       This engine looks for comments inside braces <code>{`{ ... }`}</code> to trigger card creation.
                       The FEN is captured for the position *after* the move is played. Variations in <code>( ... )</code> are listed on the back.
                     </p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Layout className="w-6 h-6 text-slate-400" />
                  <h2 className="text-xl font-bold text-slate-900">Generated Flashcards ({flashcards.length})</h2>
                </div>
                {flashcards.length > 0 && (
                  <button 
                    onClick={copyJson}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1"
                  >
                    <span>Copy JSON Schema</span>
                  </button>
                )}
              </div>

              {flashcards.length === 0 && !loading ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl h-[500px] flex flex-col items-center justify-center text-center p-8">
                  <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <BookOpen className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No Flashcards Yet</h3>
                  <p className="text-slate-500 max-w-xs mt-2">
                    Parse a PGN file with annotated moves to see your educational content here.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {flashcards.map((card) => (
                    <div key={card.card_id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Front</span>
                            <span className="text-xs text-slate-400 font-medium">Card #{card.card_id}</span>
                           </div>
                           <div className="flex items-center space-x-2 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                             <span className="text-[10px] font-bold text-indigo-700">MOVE {card.back_content.move_number}</span>
                           </div>
                        </div>
                        <p className="text-lg font-serif italic text-slate-800 leading-snug">
                          "{card.front_content.comment_text}"
                        </p>
                      </div>

                      <div className="flex-1 p-6 bg-slate-50/50 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Back</span>
                           </div>
                           <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500">
                             <User className="w-3 h-3" />
                             <span className="uppercase">{card.back_content.player_to_move}'S TURN</span>
                           </div>
                        </div>
                        <div className="flex space-x-4">
                          <div className="shrink-0">
                            <ChessBoard fen={card.back_content.position_fen} size={140} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Variations</h4>
                            <p className="text-xs text-slate-600 font-mono line-clamp-4">
                              {card.back_content.variations_text || "None"}
                            </p>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase mt-4 mb-1">FEN</h4>
                            <p className="text-[9px] text-slate-400 font-mono truncate cursor-help" title={card.back_content.position_fen}>
                              {card.back_content.position_fen}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Print Only Section */}
      {flashcards.length > 0 && <PrintView flashcards={flashcards} />}

      <style>{`
        .print-only {
          display: none;
        }

        @media print {
          @page {
            size: letter;
            margin: 0;
          }
          
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }

          .web-content {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          .page-break {
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
