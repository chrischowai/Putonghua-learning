import React, { useState, useEffect } from 'react';
import { WORD_PUZZLE_DATA } from '../../data';
import { speak, playSoundEffect } from '../../services/audioService';
import { ArrowLeft, RefreshCw, Volume2, Hammer } from 'lucide-react';

interface WordPuzzleProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

export const WordPuzzle: React.FC<WordPuzzleProps> = ({ onBack, onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [availableChars, setAvailableChars] = useState<{id: string, char: string}[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const currentPuzzle = WORD_PUZZLE_DATA[currentIndex];

  useEffect(() => {
    loadPuzzle();
  }, [currentIndex]);

  const loadPuzzle = () => {
    setSlots([null, null]);
    setIsComplete(false);
    setFeedback('none');
    
    // Mix correct chars and distractors
    const allChars = [...currentPuzzle.chars, ...currentPuzzle.distractors];
    // Create objects with IDs to handle duplicate characters if any
    const charObjects = allChars.map((c, i) => ({ id: `${i}-${c}`, char: c }));
    // Shuffle
    setAvailableChars(charObjects.sort(() => Math.random() - 0.5));
    
    // Auto speak
    setTimeout(() => speak(currentPuzzle.word), 500);
  };

  const handleCharClick = (charObj: {id: string, char: string}) => {
    if (isComplete) return;

    // Find first empty slot
    const firstEmptyIndex = slots.indexOf(null);
    if (firstEmptyIndex === -1) return; // All full

    const newSlots = [...slots];
    newSlots[firstEmptyIndex] = charObj.char;
    setSlots(newSlots);

    // Remove from available
    setAvailableChars(prev => prev.filter(c => c.id !== charObj.id));

    // Check if full
    if (firstEmptyIndex === 1) { // If we just filled the last slot (index 1)
        checkAnswer(newSlots as string[]);
    } else {
        playSoundEffect('pop');
    }
  };

  const handleSlotClick = (index: number) => {
    if (isComplete || !slots[index]) return;

    const charToReturn = slots[index];
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);

    // Return to available (generate new ID to avoid conflict, or simpler just push back)
    // We need to find a way to consistently bring it back. 
    // For simplicity, we just create a new object since ID uniqueness in pool matters for key
    if (charToReturn) {
        setAvailableChars(prev => [...prev, { id: `return-${Date.now()}`, char: charToReturn }]);
    }
  };

  const checkAnswer = (filledSlots: string[]) => {
    const formedWord = filledSlots.join('');
    if (formedWord === currentPuzzle.word) {
        setIsComplete(true);
        setFeedback('correct');
        playSoundEffect('correct');
        onScoreUpdate(15);
        speak("太棒了! " + currentPuzzle.word);
        setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % WORD_PUZZLE_DATA.length);
        }, 2000);
    } else {
        setFeedback('wrong');
        playSoundEffect('wrong');
        speak("不對哦，再試一次");
        setTimeout(() => {
            // Reset
            setFeedback('none');
            setSlots([null, null]);
            
            // Reset available chars
            const allChars = [...currentPuzzle.chars, ...currentPuzzle.distractors];
            const charObjects = allChars.map((c, i) => ({ id: `${i}-${c}`, char: c }));
            setAvailableChars(charObjects.sort(() => Math.random() - 0.5));
        }, 1000);
    }
  };

  const playWord = () => {
    speak(currentPuzzle.word);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="flex items-center gap-2 bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
           <span className="text-xl font-bold text-amber-700">詞語建築師</span>
           <Hammer size={20} className="text-amber-600" />
        </div>
        <div className="w-10"></div>
      </div>

      {/* Blueprint Area */}
      <div className="bg-blue-600 p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden border-4 border-blue-800">
         {/* Grid pattern background */}
         <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
         </div>

         <div className="relative z-10 flex flex-col items-center">
            {/* Hint Card */}
            <div className="bg-yellow-100 px-8 py-4 rounded-xl shadow-lg transform -rotate-2 mb-8 flex items-center gap-3 animate-float-balloon">
               <button onClick={playWord} className="bg-yellow-300 p-2 rounded-full text-yellow-800 hover:bg-yellow-400 transition-colors">
                 <Volume2 size={24} />
               </button>
               {/* Display Pinyin instead of Chinese characters (meaning) */}
               <span className="text-3xl font-bold text-gray-800">{currentPuzzle.pinyin}</span>
            </div>

            {/* Construction Slots */}
            <div className="flex gap-4 mb-8">
               {slots.map((char, idx) => (
                 <button 
                   key={idx}
                   onClick={() => handleSlotClick(idx)}
                   className={`
                     w-32 h-32 rounded-2xl border-4 border-dashed flex items-center justify-center text-6xl font-bold shadow-inner transition-all
                     ${char ? 'bg-amber-100 border-amber-500 text-gray-800 border-solid shadow-xl scale-105' : 'bg-blue-700/50 border-blue-400 text-white/30'}
                     ${feedback === 'wrong' ? 'animate-shake border-red-400 bg-red-100' : ''}
                     ${feedback === 'correct' ? 'animate-pop border-green-400 bg-green-100' : ''}
                   `}
                 >
                   {char || "?"}
                 </button>
               ))}
            </div>

            {/* Character Blocks (Options) */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-black/20 rounded-2xl w-full">
               {availableChars.map((charObj) => (
                 <button
                   key={charObj.id}
                   onClick={() => handleCharClick(charObj)}
                   className="bg-white h-20 rounded-xl shadow-[0_4px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center text-3xl font-bold text-gray-700 hover:bg-gray-50"
                 >
                   {charObj.char}
                 </button>
               ))}
               {availableChars.length === 0 && !isComplete && (
                  <div className="col-span-4 text-center text-white/50 font-bold py-4">
                     點擊上方方塊可取消選擇
                  </div>
               )}
            </div>
         </div>
      </div>

      <div className="mt-8 text-center text-gray-400 font-bold">
         {currentIndex + 1} / {WORD_PUZZLE_DATA.length}
      </div>
    </div>
  );
};