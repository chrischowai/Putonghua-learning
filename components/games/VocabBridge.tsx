import React, { useState } from 'react';
import { VOCAB_BRIDGE_DATA } from '../../data';
import { speakSync as speak, playSoundEffect } from '../../services/audioService';
import { ArrowLeft, CheckCircle2, Volume2 } from 'lucide-react';
import { Vocabulary } from '../../types';

interface VocabBridgeProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

export const VocabBridge: React.FC<VocabBridgeProps> = ({ onBack, onScoreUpdate }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [completedPairs, setCompletedPairs] = useState<string[]>([]);
  const [isWrongAnim, setIsWrongAnim] = useState(false);

  // Shuffle for left and right columns
  const [leftItems] = useState([...VOCAB_BRIDGE_DATA].sort(() => Math.random() - 0.5));
  const [rightItems] = useState([...VOCAB_BRIDGE_DATA].sort(() => Math.random() - 0.5));

  const handleLeftClick = (id: string) => {
    if (completedPairs.includes(id)) return;
    setSelectedLeft(id);
    // speak(VOCAB_BRIDGE_DATA.find(v => v.id === id)?.cantonese || "Cantonese");
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speak(text);
  };

  const handleRightClick = (vocab: Vocabulary) => {
    if (completedPairs.includes(vocab.id)) return;
    
    if (selectedLeft === null) {
      speak(vocab.char); // Speak if just clicking without a match
      return;
    }

    if (selectedLeft === vocab.id) {
      // Match!
      playSoundEffect('correct');
      speak(vocab.char);
      setCompletedPairs([...completedPairs, vocab.id]);
      setSelectedLeft(null);
      onScoreUpdate(15);
    } else {
      // Wrong
      playSoundEffect('wrong');
      setIsWrongAnim(true);
      setTimeout(() => {
        setIsWrongAnim(false);
        setSelectedLeft(null);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="text-2xl font-bold text-green-600">詞語橋樑</div>
        <div className="w-10"></div>
      </div>

      <p className="mb-6 text-gray-600 text-lg">選擇一個廣東話詞語，然後找出對應的普通話！</p>

      <div className="flex w-full justify-between gap-8">
        {/* Left Column (Cantonese) */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-center text-xl font-bold text-gray-500 mb-2">廣東話</h3>
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              disabled={completedPairs.includes(item.id)}
              className={`
                p-4 rounded-2xl shadow-md text-2xl font-bold transition-all relative
                ${completedPairs.includes(item.id) 
                  ? 'bg-gray-100 text-gray-300 cursor-default scale-95' 
                  : selectedLeft === item.id 
                    ? 'bg-green-500 text-white scale-105 shadow-xl ring-4 ring-green-200' 
                    : 'bg-white text-gray-700 hover:bg-green-50'
                }
              `}
            >
               {completedPairs.includes(item.id) ? <CheckCircle2 className="mx-auto" /> : item.cantonese}
            </button>
          ))}
        </div>

        {/* Right Column (Putonghua) */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-center text-xl font-bold text-gray-500 mb-2">普通話</h3>
          {rightItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRightClick(item)}
              className={`
                p-4 rounded-2xl shadow-md transition-all cursor-pointer relative flex items-center justify-center min-h-[80px]
                ${completedPairs.includes(item.id) 
                  ? 'bg-gray-100 text-gray-300 cursor-default scale-95' 
                  : 'bg-white text-gray-700 hover:bg-sky-50'
                }
                ${isWrongAnim && selectedLeft && selectedLeft !== item.id ? 'shake' : ''}
              `}
            >
              {completedPairs.includes(item.id) ? (
                 <CheckCircle2 className="mx-auto" />
              ) : (
                <>
                  <button 
                    onClick={(e) => handleSpeak(e, item.char)}
                    className="absolute left-4 p-2 bg-sky-100 rounded-full text-sky-500 hover:bg-sky-200 active:scale-95 transition-all"
                    title="聆聽"
                  >
                    <Volume2 size={20} />
                  </button>
                  <span className="text-3xl font-bold pl-8">{item.char}</span>
                  {/* Pinyin is hidden intentionally */}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};