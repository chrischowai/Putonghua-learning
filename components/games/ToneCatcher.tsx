import React, { useState, useEffect } from 'react';
import { getToneData } from '../../data';
import { speakSync as speak, playSoundEffect } from '../../services/audioService';
import { Volume2, ArrowLeft, RefreshCw, Star } from 'lucide-react';
import { Vocabulary } from '../../types';

interface ToneCatcherProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

export const ToneCatcher: React.FC<ToneCatcherProps> = ({ onBack, onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledData, setShuffledData] = useState<Vocabulary[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [poppedTone, setPoppedTone] = useState<number | null>(null);

  useEffect(() => {
    // Dynamically get items including user vocab
    const randomSet = getToneData();
    setShuffledData(randomSet);
  }, []);

  const currentItem = shuffledData[currentIndex];

  const handleToneClick = (selectedTone: number) => {
    if (feedback !== 'none' || !currentItem) return; 

    speak(currentItem.char);

    if (selectedTone === currentItem.tone) {
      setFeedback('correct');
      setPoppedTone(selectedTone);
      playSoundEffect('correct');
      playSoundEffect('pop');
      onScoreUpdate(10);
      setTimeout(() => {
        setPoppedTone(null);
        nextQuestion();
      }, 1500);
    } else {
      setFeedback('wrong');
      playSoundEffect('wrong');
      setTimeout(() => {
        setFeedback('none');
      }, 1000);
    }
  };

  const nextQuestion = () => {
    setFeedback('none');
    setCurrentIndex((prev) => (prev + 1) % shuffledData.length);
  };

  const playSound = () => {
    if (currentItem) speak(currentItem.char);
  };

  if (!currentItem) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 overflow-hidden relative">
      {/* Confetti (CSS driven) when correct */}
      {feedback === 'correct' && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
           {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  backgroundColor: ['#FFD700', '#FF6347', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)],
                  animation: `confetti 1s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
             />
           ))}
        </div>
      )}

      <div className="w-full flex justify-between items-center mb-4 z-10">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="text-2xl font-bold text-sky-600 bg-white/80 px-4 py-1 rounded-full">聲調氣球</div>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full text-center relative overflow-hidden mb-12 border-b-8 border-sky-100 z-10">
        <div className="mb-2">
          <button 
            onClick={playSound}
            className="bg-sky-100 p-4 rounded-full text-sky-600 hover:bg-sky-200 transition-colors mb-4 mx-auto block animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            <Volume2 size={40} />
          </button>
          <div className="text-8xl font-bold text-gray-800 mb-2">{currentItem.char}</div>
          <div className="text-xl text-gray-400">戳破對應的聲調氣球！</div>
          {currentItem.source === 'user' && (
             <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-500 text-xs px-2 py-1 rounded-full font-bold">
               自訂
             </div>
          )}
        </div>
      </div>

      {/* Balloons Container */}
      <div className="grid grid-cols-4 gap-4 w-full h-64 items-end justify-items-center">
        {[1, 2, 3, 4].map((tone) => {
          const isPopped = poppedTone === tone;
          return (
            <button
              key={tone}
              onClick={() => handleToneClick(tone)}
              disabled={feedback !== 'none'}
              className={`
                relative group flex flex-col items-center justify-center transition-all duration-300
                ${isPopped ? 'opacity-0 scale-150' : 'opacity-100 animate-float-balloon'}
              `}
              style={{ animationDelay: `${tone * 0.5}s` }}
            >
              {/* Balloon String */}
              <div className="absolute top-full left-1/2 w-0.5 h-16 bg-gray-300 origin-top transform -translate-x-1/2"></div>
              
              {/* Balloon Body */}
              <div className={`
                 w-24 h-28 rounded-[50%] shadow-inner flex items-center justify-center relative
                 border-b-8 border-black/10 active:scale-95 transition-transform
                 ${tone === 1 ? 'bg-red-400' : ''}
                 ${tone === 2 ? 'bg-yellow-400' : ''}
                 ${tone === 3 ? 'bg-green-400' : ''}
                 ${tone === 4 ? 'bg-purple-400' : ''}
              `}>
                 {/* Shine */}
                 <div className="absolute top-4 left-4 w-6 h-10 bg-white/30 rounded-[50%] transform -rotate-12"></div>
                 
                 <span className="text-5xl font-bold text-white drop-shadow-md">
                   {tone === 1 && '—'}
                   {tone === 2 && '／'}
                   {tone === 3 && '∨'}
                   {tone === 4 && '＼'}
                 </span>
              </div>
              
              {/* Label below string */}
              <span className="mt-16 text-sm font-bold text-gray-400 bg-white/80 px-2 rounded">
                 第 {tone} 聲
              </span>
            </button>
          );
        })}
      </div>
      
      <button onClick={nextQuestion} className="mt-8 flex items-center text-gray-400 hover:text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
        <RefreshCw size={16} className="mr-2" /> 跳過
      </button>
    </div>
  );
};