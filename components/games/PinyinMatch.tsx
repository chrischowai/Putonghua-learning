import React, { useState } from 'react';
import { PINYIN_MATCH_DATA } from '../../data';
import { speak, playSoundEffect } from '../../services/audioService';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';

interface PinyinMatchProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

export const PinyinMatch: React.FC<PinyinMatchProps> = ({ onBack, onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Generate 3 random incorrect options plus the correct one
  const [options, setOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentItem = PINYIN_MATCH_DATA[currentIndex];

  React.useEffect(() => {
    generateOptions();
  }, [currentIndex]);

  const generateOptions = () => {
    const correct = PINYIN_MATCH_DATA[currentIndex].pinyin;
    const others = PINYIN_MATCH_DATA
      .filter((_, idx) => idx !== currentIndex)
      .map(i => i.pinyin)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setOptions([correct, ...others].sort(() => Math.random() - 0.5));
    setIsAnswered(false);
  };

  const playWord = () => {
    speak(currentItem.char);
  };

  const handleOptionClick = (pinyin: string) => {
    if (isAnswered) return;

    if (pinyin === currentItem.pinyin) {
      setIsAnswered(true);
      playSoundEffect('correct');
      speak("答對了! " + currentItem.char);
      onScoreUpdate(10);
      setTimeout(() => {
         setCurrentIndex((prev) => (prev + 1) % PINYIN_MATCH_DATA.length);
      }, 1500);
    } else {
      playSoundEffect('wrong');
      speak("再試一次");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="text-2xl font-bold text-purple-600">拼音配對</div>
        <div className="w-10"></div>
      </div>

      <div className="relative">
        <div className="bg-white p-12 rounded-full shadow-2xl mb-10 w-64 h-64 flex items-center justify-center border-8 border-purple-100">
          <span className="text-8xl font-bold text-gray-800">{currentItem.char}</span>
        </div>
        <button 
          onClick={playWord}
          className="absolute bottom-10 right-0 bg-purple-100 p-3 rounded-full text-purple-600 shadow-md hover:bg-purple-200 transition-transform hover:scale-110"
        >
          <Volume2 size={32} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {options.map((opt, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(opt)}
            className={`
              p-6 rounded-2xl shadow-lg text-3xl font-bold transition-all transform hover:-translate-y-1
              ${isAnswered && opt === currentItem.pinyin 
                ? 'bg-green-500 text-white scale-105' 
                : 'bg-white text-gray-700 hover:bg-purple-50'}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
       {isAnswered && (
          <div className="mt-8 animate-bounce text-yellow-500 flex items-center">
             <Star fill="currentColor" size={32} />
             <span className="ml-2 text-xl font-bold">做得好！</span>
          </div>
       )}
    </div>
  );
};