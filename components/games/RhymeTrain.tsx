import React, { useState, useEffect } from 'react';
import { RHYME_GAME_DATA, VOCABULARY_DB } from '../../data';
import { speakSync as speak, playSoundEffect } from '../../services/audioService';
import { ArrowLeft, Play, TrainFront, Cloud } from 'lucide-react';
import { Vocabulary } from '../../types';

interface RhymeTrainProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

interface FloatingItem extends Vocabulary {
  instanceId: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
  speed: number;
  isCorrect: boolean;
  status: 'active' | 'loading' | 'missed';
}

const FINALS = Object.keys(RHYME_GAME_DATA);

export const RhymeTrain: React.FC<RhymeTrainProps> = ({ onBack, onScoreUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetFinal, setTargetFinal] = useState<string>('');
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [score, setScore] = useState(0);
  const [consecutive, setConsecutive] = useState(0);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setItems(prev => 
        prev
          .map(item => ({
            ...item,
            x: item.status === 'active' ? item.x - item.speed : item.x, // Move left
          }))
          .filter(item => item.x > -20) // Remove if off screen
      );
    }, 50);

    const spawnInterval = setInterval(() => {
        spawnItem();
    }, 2000);

    return () => {
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [isPlaying, targetFinal]);

  const startGame = () => {
    const randomFinal = FINALS[Math.floor(Math.random() * FINALS.length)];
    setTargetFinal(randomFinal);
    setIsPlaying(true);
    setItems([]);
    setScore(0);
    speak(`請找出韻母是 ${randomFinal} 的字`);
  };

  const spawnItem = () => {
    // 40% chance of correct item
    const isCorrect = Math.random() < 0.4;
    let word: Vocabulary;

    if (isCorrect) {
       // Get from specific list
       const list = RHYME_GAME_DATA[targetFinal as keyof typeof RHYME_GAME_DATA];
       word = list[Math.floor(Math.random() * list.length)];
    } else {
       // Get random word that DOESNT match
       const others = VOCABULARY_DB.filter(w => w.final !== targetFinal);
       word = others[Math.floor(Math.random() * others.length)];
    }

    if (!word) return;

    const newItem: FloatingItem = {
      ...word,
      instanceId: Math.random().toString(),
      x: 100, // Start at right
      y: 10 + Math.random() * 40, // Random height
      speed: 0.2 + Math.random() * 0.2,
      isCorrect: word.final === targetFinal,
      status: 'active'
    };

    setItems(prev => [...prev, newItem]);
  };

  const handleItemClick = (item: FloatingItem) => {
    if (item.status !== 'active') return;

    speak(item.char);

    if (item.isCorrect) {
      playSoundEffect('correct');
      onScoreUpdate(10);
      setScore(s => s + 10);
      setConsecutive(p => p + 1);
      
      // Animate into train
      setItems(prev => prev.map(i => 
        i.instanceId === item.instanceId ? { ...i, status: 'loading' } : i
      ));

      // Remove after animation
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.instanceId !== item.instanceId));
      }, 500);

    } else {
      playSoundEffect('wrong');
      speak("不是這個");
      setConsecutive(0);
      setItems(prev => prev.map(i => 
        i.instanceId === item.instanceId ? { ...i, status: 'missed' } : i
      ));
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen max-w-5xl mx-auto p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-sky-200 -z-20"></div>
      
      {/* Moving Background Elements */}
      <div className="absolute bottom-0 w-[200%] h-32 bg-green-300 rounded-t-[50%] animate-swim-left -z-10 opacity-80"></div>
      <div className="absolute bottom-10 w-[200%] h-32 bg-green-400 rounded-t-[50%] animate-swim-left -z-10" style={{ animationDuration: '15s' }}></div>
      <div className="absolute top-20 left-20 animate-float-balloon opacity-60"><Cloud size={100} color="white" fill="white" /></div>
      <div className="absolute top-40 right-20 animate-float-balloon opacity-40" style={{ animationDelay: '2s' }}><Cloud size={80} color="white" fill="white" /></div>

      {/* Header */}
      <div className="w-full flex justify-between items-center z-10 mb-2">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg border-2 border-rose-200">
           <span className="text-xl font-bold text-rose-800 mr-2">韻母小火車</span>
        </div>
        <div className="w-10"></div>
      </div>

      {!isPlaying ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-50">
             <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-lg border-b-8 border-rose-200">
                <div className="flex justify-center mb-4">
                  <div className="bg-rose-100 p-6 rounded-full animate-bounce">
                    <TrainFront size={64} className="text-rose-500" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-rose-600 mb-4 tracking-wide">韻母小火車</h2>
                <p className="text-gray-600 mb-6 text-xl">
                    幫助火車收集正確的貨物！
                </p>
                <button 
                  onClick={startGame}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-lg transform hover:scale-105 transition-all flex items-center mx-auto"
                >
                  <Play className="mr-2" /> 開始遊戲
                </button>
             </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          
          {/* THE TRAIN */}
          <div className="absolute bottom-20 left-4 z-20 flex items-end">
             {/* Engine */}
             <div className="relative z-10">
               <div className="w-40 h-32 bg-rose-500 rounded-xl relative shadow-xl flex items-center justify-center border-4 border-rose-700">
                 {/* Smoke */}
                 <div className="absolute -top-10 left-4 flex gap-1">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-float-text" style={{ animationDelay: '0s' }}></div>
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-float-text" style={{ animationDelay: '0.5s' }}></div>
                 </div>
                 {/* Label */}
                 <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-inner">
                    <span className="text-6xl font-bold text-rose-600 pb-2">{targetFinal}</span>
                 </div>
               </div>
               {/* Wheels */}
               <div className="absolute -bottom-6 left-2 flex gap-4 animate-shake">
                 <div className="w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-400 animate-spin" style={{ animationDuration: '2s' }}></div>
                 <div className="w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-400 animate-spin" style={{ animationDuration: '2s' }}></div>
               </div>
             </div>
             
             {/* Cart (Visual only) */}
             <div className="w-32 h-24 bg-rose-400 rounded-lg ml-2 relative shadow-lg border-4 border-rose-600 flex items-center justify-center">
                 <div className="text-white font-bold text-2xl opacity-50">Cargo</div>
                 <div className="absolute -bottom-6 left-4 flex gap-2">
                    <div className="w-10 h-10 bg-gray-800 rounded-full border-4 border-gray-400 animate-spin" style={{ animationDuration: '2s' }}></div>
                    <div className="w-10 h-10 bg-gray-800 rounded-full border-4 border-gray-400 animate-spin" style={{ animationDuration: '2s' }}></div>
                 </div>
             </div>
          </div>

          {/* Items on Conveyor */}
          {items.map(item => (
            <button
              key={item.instanceId}
              onClick={() => handleItemClick(item)}
              className={`
                absolute rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center transition-all duration-500
                ${item.status === 'active' ? 'bg-white hover:scale-110 cursor-pointer' : ''}
                ${item.status === 'loading' ? 'bg-green-400 text-white scale-50 opacity-0 !left-[150px] !top-[60%]' : ''}
                ${item.status === 'missed' ? 'bg-red-400 text-white translate-y-20 opacity-0 rotate-45' : ''}
              `}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: '100px',
                height: '100px',
                zIndex: item.status === 'loading' ? 30 : 10
              }}
            >
              <span className="text-4xl font-bold mb-1">{item.char}</span>
              <span className="text-xs text-gray-400 font-bold bg-gray-100 px-2 rounded">{item.pinyin}</span>
            </button>
          ))}

          {/* Track */}
          <div className="absolute bottom-16 left-0 w-full h-4 bg-gray-700"></div>
          <div className="absolute bottom-10 left-0 w-full flex gap-12">
             {[...Array(20)].map((_,i) => (
                <div key={i} className="w-4 h-8 bg-amber-800"></div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};
