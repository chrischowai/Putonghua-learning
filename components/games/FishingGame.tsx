import React, { useState, useEffect, useRef } from 'react';
import { getAllVocabulary } from '../../data';
import { speakSync, playSoundEffect } from '../../services/audioService';
import { ArrowLeft, Play, XCircle, CheckCircle2, Ship } from 'lucide-react';
import { Vocabulary } from '../../types';

interface FishingGameProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

interface Fish extends Vocabulary {
  instanceId: string;
  x: number;
  y: number;
  direction: 'left' | 'right';
  speed: number;
  isCaught: boolean;
}

// Generate some random bubbles
const BUBBLES = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 10 + Math.random() * 30,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 6
}));

export const FishingGame: React.FC<FishingGameProps> = ({ onBack, onScoreUpdate }) => {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [targetInitial, setTargetInitial] = useState<string>('b');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [floatingPoints, setFloatingPoints] = useState<{id: number, val: number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game loop for spawning and moving fish
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const spawnInterval = setInterval(() => {
      spawnFish();
    }, 1200);

    const moveInterval = setInterval(() => {
      setFishes(prev => 
        prev
          .map(fish => ({
            ...fish,
            x: fish.direction === 'right' ? fish.x + fish.speed : fish.x - fish.speed
          }))
          .filter(fish => fish.x > -20 && fish.x < 120) // Remove fish that swim off screen
      );
    }, 50);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          playSoundEffect('pop'); // Game over sound
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  }, [isPlaying, isPaused]);

  useEffect(() => {
    const initials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l'];
    const randomInitial = initials[Math.floor(Math.random() * initials.length)];
    setTargetInitial(randomInitial);
  }, [isPlaying]);

  const spawnFish = () => {
    const ALL_WORDS = getAllVocabulary();
    // 1. Get words that match target
    const targets = ALL_WORDS.filter(w => w.initial === targetInitial);
    // 2. Get words that don't match
    const others = ALL_WORDS.filter(w => w.initial !== targetInitial);
    
    // 40% chance to spawn a target fish if targets exist
    const shouldSpawnTarget = targets.length > 0 && Math.random() < 0.4;
    
    let finalWord: Vocabulary;
    if (shouldSpawnTarget) {
      finalWord = targets[Math.floor(Math.random() * targets.length)];
    } else {
      // Fallback if no others available (unlikely)
      if (others.length === 0) return;
      finalWord = others[Math.floor(Math.random() * others.length)];
    }

    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const startX = direction === 'right' ? -15 : 115;
    
    const newFish: Fish = {
      ...finalWord,
      instanceId: Math.random().toString(36).substr(2, 9),
      x: startX,
      y: 20 + Math.random() * 60, // Keep in water area
      direction,
      speed: 0.2 + Math.random() * 0.3,
      isCaught: false
    };

    setFishes(prev => [...prev, newFish]);
  };

  const handleFishClick = (fish: Fish) => {
    if (!isPlaying || isPaused || fish.isCaught) return;
    setIsPaused(true);
    setSelectedFish(fish);
    speakSync(fish.char);
  };

  const confirmCatch = () => {
    if (!selectedFish) return;

    if (selectedFish.initial === targetInitial) {
      playSoundEffect('correct');
      setScore(s => s + 10);
      onScoreUpdate(10);
      speakSync("做得好!");
      
      // Floating points animation
      const id = Date.now();
      setFloatingPoints(prev => [...prev, { id, val: 10 }]);
      setTimeout(() => setFloatingPoints(prev => prev.filter(p => p.id !== id)), 1000);

      // Reeling animation: Move fish to boat (top center approximately)
      setFishes(prev => prev.map(f => {
         if (f.instanceId === selectedFish.instanceId) {
             return { ...f, isCaught: true, y: -20, x: 50 }; // Move to top center
         }
         return f;
      }));
      
      setTimeout(() => {
        setFishes(prev => prev.filter(f => f.instanceId !== selectedFish.instanceId));
      }, 500);
    } else {
      playSoundEffect('wrong');
      speakSync("哎呀，錯了！");
    }

    setSelectedFish(null);
    setIsPaused(false);
  };

  const cancelCatch = () => {
    setSelectedFish(null);
    setIsPaused(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setScore(0);
    setTimeLeft(45);
    setFishes([]);
    speakSync(`釣起以 ${targetInitial} 開頭的魚`);
  };

  return (
    <div className="flex flex-col items-center w-full h-screen max-w-5xl mx-auto p-4 relative overflow-hidden">
       {/* Deep Ocean Background */}
       <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-400 to-blue-600 -z-20"></div>
       
       {/* Animated Bubbles */}
       {BUBBLES.map(b => (
         <div 
           key={b.id}
           className="bubble"
           style={{
             left: `${b.left}%`,
             width: `${b.size}px`,
             height: `${b.size}px`,
             animationDuration: `${b.duration}s`,
             animationDelay: `${b.delay}s`
           }}
         />
       ))}

      {/* Header */}
      <div className="w-full flex justify-between items-center z-10 mb-2">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg border-2 border-blue-200 transform hover:scale-105 transition-transform">
             <span className="text-xl font-bold text-blue-800 mr-2">目標聲母:</span>
             <span className="text-4xl font-bold text-red-500 uppercase drop-shadow-sm">{targetInitial}</span>
        </div>
        <div className="bg-yellow-300 px-4 py-2 rounded-full font-bold text-yellow-800 shadow border-2 border-yellow-400">
          時間: {timeLeft}秒
        </div>
      </div>

      {/* Game Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full relative rounded-3xl border-4 border-blue-300/50 overflow-hidden shadow-2xl bg-opacity-10 backdrop-blur-[1px]"
      >
        {/* Boat Decoration */}
        <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 z-0 animate-bounce" style={{ animationDuration: '3s' }}>
            <Ship size={80} className="text-white drop-shadow-lg" />
            <div className="w-1 bg-gray-700 h-20 absolute left-1/2 top-10 -z-10"></div>
        </div>

        {/* Floating Points Feedback */}
        {floatingPoints.map(fp => (
          <div key={fp.id} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-300 animate-float-text z-50 pointer-events-none drop-shadow-md">
            +{fp.val}
          </div>
        ))}

        {!isPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-20">
             <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-lg border-b-8 border-blue-200">
                <h2 className="text-5xl font-bold text-blue-500 mb-4 tracking-wide">快樂釣魚</h2>
                <p className="text-gray-600 mb-6 text-xl">
                    釣起所有以 <span className="font-bold text-4xl text-red-500 mx-2">"{targetInitial}"</span> 開頭的魚！
                </p>
                {score > 0 && <p className="text-2xl font-bold text-yellow-500 mb-4">上次得分: {score}</p>}
                <button 
                  onClick={startGame}
                  className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-lg transform hover:scale-105 transition-all flex items-center mx-auto"
                >
                  <Play className="mr-2" /> 開始遊戲
                </button>
             </div>
          </div>
        ) : (
           // Render Fishes
           fishes.map(fish => (
             <div
               key={fish.instanceId}
               onClick={(e) => {
                 e.stopPropagation();
                 handleFishClick(fish);
               }}
               className={`absolute transition-all cursor-pointer ${fish.isCaught ? 'transition-all duration-500 ease-in-out' : 'hover:scale-110'}`}
               style={{
                 left: `${fish.x}%`,
                 top: `${fish.y}%`,
                 transform: `scaleX(${fish.direction === 'right' ? -1 : 1})`,
                 opacity: fish.isCaught ? 0 : 1,
               }}
             >
               <div className="relative group">
                  {/* Fish SVG - All same color */}
                  <svg width="90" height="70" viewBox="0 0 100 80" className="drop-shadow-lg filter group-hover:brightness-110">
                    <path
                      d="M95,40 C80,30 80,10 60,10 C30,10 10,30 5,40 C10,50 30,70 60,70 C80,70 80,50 95,40 Z M95,40 L100,20 L100,60 Z"
                      fill={fish.source === 'user' ? '#FFD700' : '#48DBFB'}
                      stroke="white"
                      strokeWidth="3"
                    />
                    <circle cx="25" cy="35" r="4" fill="white" />
                    <circle cx="25" cy="35" r="2" fill="black" />
                    {/* Fin */}
                    <path d="M50,20 Q60,5 70,20" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                  {/* Text on fish */}
                  <div 
                    className="absolute top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2 font-bold text-white text-2xl drop-shadow-md"
                    style={{ transform: `translate(-50%, -50%) scaleX(${fish.direction === 'right' ? -1 : 1})` }}
                  >
                    {fish.char}
                  </div>
               </div>
             </div>
           ))
        )}

        {/* Confirmation Dialog Overlay */}
        {isPaused && selectedFish && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center max-w-sm w-full animate-pop border-4 border-blue-100 relative">
                
                {/* Visual Fishing Hook Line to Dialog */}
                <div className="absolute -top-[50vh] left-1/2 w-1 bg-gray-800 h-[50vh] -z-10"></div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 w-4 h-4 rounded-full"></div>

                <h3 className="text-xl text-gray-500 mb-4 font-bold uppercase tracking-wider">釣到了！</h3>
                
                <div className="bg-blue-50 w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4 border-blue-200 animate-bounce">
                  <span className="text-6xl font-bold text-blue-600">{selectedFish.char}</span>
                </div>
                
                <p className="text-gray-600 mb-8 text-center text-lg">
                    它是以 <span className="font-bold text-3xl text-red-500 mx-1">{targetInitial}</span> 開頭的嗎？
                </p>
                
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={cancelCatch}
                    className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={24} /> 放走
                  </button>
                  <button 
                    onClick={confirmCatch}
                    className="flex-1 py-3 px-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center gap-2 border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
                  >
                    <CheckCircle2 size={24} /> 收穫！
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};