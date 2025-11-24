import React, { useState, useEffect } from 'react';
import { SORTING_DATA, TONE_DATA } from '../../data';
import { speak, playSoundEffect } from '../../services/audioService';
import { ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import { Vocabulary } from '../../types';

interface SortingGameProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

const CATEGORIES = ['b', 'p', 'm', 'f'];

export const SortingGame: React.FC<SortingGameProps> = ({ onBack, onScoreUpdate }) => {
  const validWords = [...SORTING_DATA, ...TONE_DATA].filter(w => CATEGORIES.includes(w.initial || ''));
  
  const [currentWord, setCurrentWord] = useState<Vocabulary | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetBox, setTargetBox] = useState<string | null>(null);

  useEffect(() => {
    nextWord();
  }, []);

  const nextWord = () => {
    const random = validWords[Math.floor(Math.random() * validWords.length)];
    setCurrentWord(random);
    setFeedback('none');
    setTargetBox(null);
    setIsAnimating(false);
  };

  const playWord = () => {
    if (currentWord) {
      speak(currentWord.char);
    }
  };

  const handleSort = (category: string) => {
    if (!currentWord || isAnimating) return;

    if (currentWord.initial === category) {
      // Animation sequence
      setIsAnimating(true);
      setTargetBox(category);
      setFeedback('correct');
      playSoundEffect('correct');
      speak("做得好!");
      onScoreUpdate(10);
      setScore(s => s + 10);

      // Wait for animation
      setTimeout(nextWord, 1500);
    } else {
      setFeedback('wrong');
      playSoundEffect('wrong');
      speak("再試一次");
      setTimeout(() => setFeedback('none'), 800);
    }
  };

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 min-h-[80vh]">
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="text-2xl font-bold text-indigo-600 bg-white/50 px-6 py-2 rounded-full">分類郵局</div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        
        {/* Helper Character (Panda) */}
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-80 pointer-events-none hidden md:block">
           <svg width="120" height="120" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="45" fill="white" stroke="#333" strokeWidth="3" />
             <circle cx="35" cy="40" r="5" fill="#333" />
             <circle cx="65" cy="40" r="5" fill="#333" />
             <ellipse cx="50" cy="60" rx="10" ry="5" fill="#333" />
             {/* Ears */}
             <circle cx="20" cy="20" r="15" fill="#333" />
             <circle cx="80" cy="20" r="15" fill="#333" />
           </svg>
           {feedback === 'none' && <div className="bg-white p-2 rounded-lg absolute -left-20 top-0 shadow text-xs">幫我分類!</div>}
           {feedback === 'correct' && <div className="bg-green-100 text-green-700 p-2 rounded-lg absolute -left-20 top-0 shadow text-xs font-bold">做得好!</div>}
           {feedback === 'wrong' && <div className="bg-red-100 text-red-700 p-2 rounded-lg absolute -left-20 top-0 shadow text-xs font-bold">哎呀!</div>}
        </div>

        {/* The Falling Letter Card */}
        <div 
          className={`
            bg-white p-8 rounded-3xl shadow-2xl mb-12 border-b-8 border-gray-200 w-48 h-64
            transition-all duration-1000 ease-in-out z-20 flex flex-col items-center justify-center relative
            ${feedback === 'correct' && targetBox ? 'scale-0' : 'scale-100'}
            ${feedback === 'wrong' ? 'animate-shake border-red-300' : ''}
          `}
          style={{
             // Simple visual hack for "flying into box" - in a real app use layout interpolation
             transform: feedback === 'correct' ? `translateY(200px) scale(0.1)` : 'none',
             opacity: feedback === 'correct' ? 0 : 1
          }}
        >
           {/* Stamp/Speaker */}
           <button 
             onClick={playWord}
             className="absolute top-4 right-4 bg-indigo-50 text-indigo-500 p-2 rounded-full hover:bg-indigo-100 transition-colors"
           >
             <Volume2 size={24} />
           </button>
           
           <div className="text-8xl font-bold text-gray-800 mb-4">{currentWord.char}</div>
           
           {/* Visual 'lines' like a letter */}
           <div className="w-24 h-2 bg-gray-100 rounded mb-2"></div>
           <div className="w-16 h-2 bg-gray-100 rounded"></div>
        </div>

        {feedback === 'correct' && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
             <Sparkles size={100} className="text-yellow-400 animate-spin" />
             <div className="text-4xl font-bold text-green-500 absolute top-0 left-10 animate-float-text">+10</div>
           </div>
        )}

        <p className="text-indigo-800/60 mb-8 text-xl font-medium bg-indigo-50 px-4 py-1 rounded-lg">它屬於哪個信箱？</p>

        {/* Mailboxes */}
        <div className="grid grid-cols-4 gap-4 w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSort(cat)}
              className={`
                group relative h-48 rounded-t-3xl border-x-4 border-t-4 bg-gradient-to-b
                flex flex-col items-center justify-end pb-4 transition-all active:scale-95
                ${targetBox === cat ? 'border-green-400 from-green-50 to-green-100' : 'border-indigo-200 from-white to-indigo-50 hover:from-indigo-100'}
              `}
            >
               {/* Mailbox Slot */}
               <div className={`w-20 h-5 rounded-full mb-8 shadow-inner transition-all ${targetBox === cat ? 'bg-green-800 scale-110' : 'bg-gray-800 group-hover:bg-gray-700'}`}></div>
               
               {/* Label */}
               <div className={`
                 w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg bg-white
                 ${targetBox === cat ? 'border-green-400 text-green-600' : 'border-indigo-300 text-indigo-600'}
               `}>
                 <span className="text-4xl font-bold pb-1">{cat}</span>
               </div>

               {/* Ground connector */}
               <div className="absolute bottom-0 left-0 w-full h-2 bg-indigo-300 opacity-50"></div>
            </button>
          ))}
        </div>
        
        {/* Floor */}
        <div className="w-[120%] h-6 bg-indigo-200/50 rounded-full mt-[-2px]"></div>
      </div>
    </div>
  );
};