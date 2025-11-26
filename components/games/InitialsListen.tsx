import React, { useState, useEffect } from 'react';
import { speakSync as speak, playSoundEffect } from '../../services/audioService';
import { ArrowLeft, Music, Star, Zap, Play } from 'lucide-react';

interface InitialsListenProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

// Extended data for variety
const QUESTIONS = [
  { char: '爸', pinyin: 'bà', initial: 'b' },
  { char: '佛', pinyin: 'fó', initial: 'f' },
  { char: '媽', pinyin: 'mā', initial: 'm' },
  { char: '皮', pinyin: 'pí', initial: 'p' },
  { char: '筆', pinyin: 'bǐ', initial: 'b' },
  { char: '馬', pinyin: 'mǎ', initial: 'm' },
  { char: '發', pinyin: 'fā', initial: 'f' },
  { char: '布', pinyin: 'bù', initial: 'b' },
  { char: '怕', pinyin: 'pà', initial: 'p' },
  { char: '木', pinyin: 'mù', initial: 'm' },
  { char: '飛', pinyin: 'fēi', initial: 'f' },
];

export const InitialsListen: React.FC<InitialsListenProps> = ({ onBack, onScoreUpdate }) => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([...QUESTIONS]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [combo, setCombo] = useState(0);
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    // Shuffle on mount
    setShuffledQuestions([...QUESTIONS].sort(() => Math.random() - 0.5));
  }, []);

  const currentQ = shuffledQuestions[index];

  const playSound = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    speak(currentQ.char);
    // Animation duration for notes
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const checkAnswer = (selected: string) => {
    if (feedback !== 'none') return;

    if (selected === currentQ.initial) {
       setFeedback('correct');
       playSoundEffect('correct');
       
       // Score logic with combo bonus
       const bonus = combo >= 2 ? 5 : 0;
       onScoreUpdate(10 + bonus);
       setCombo(c => c + 1);
       
       // Show floating points
       setShowPoints(true);
       speak("做得好!");
       
       setTimeout(() => {
         setShowPoints(false);
         setFeedback('none');
         setIndex((prev) => (prev + 1) % shuffledQuestions.length);
       }, 1500);
    } else {
       setFeedback('wrong');
       playSoundEffect('wrong');
       setCombo(0); // Reset combo
       speak("再試一次");
       setTimeout(() => setFeedback('none'), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 min-h-[80vh] relative">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4 z-10">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="flex items-center gap-2 bg-white/60 px-4 py-1 rounded-full border border-orange-200">
           <span className="text-xl font-bold text-orange-600">神奇耳朵</span>
           <Music size={20} className="text-orange-500" />
        </div>
        <div className="w-10"></div>
      </div>

      {/* Combo Meter */}
      {combo > 1 && (
        <div className="absolute top-20 right-4 animate-pop bg-yellow-100 border-2 border-yellow-400 px-3 py-1 rounded-xl flex items-center gap-1 shadow-lg transform rotate-12 z-20">
          <Zap className="text-yellow-600 fill-yellow-600 animate-pulse" size={20} />
          <span className="font-bold text-yellow-700 text-lg">{combo} 連勝!</span>
        </div>
      )}

      {/* DJ Bunny Stage */}
      <div className="relative mb-12 mt-4 group cursor-pointer" onClick={playSound}>
         {/* Musical Notes Animation */}
         {isPlaying && (
           <>
             <Music className="absolute top-0 right-0 text-pink-500 animate-float-balloon" style={{ animationDuration: '2s', left: '80%' }} size={32} />
             <Music className="absolute top-10 -left-10 text-blue-500 animate-float-balloon" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} size={24} />
             <Music className="absolute -top-10 left-1/2 text-purple-500 animate-float-balloon" style={{ animationDuration: '1.8s', animationDelay: '0.4s' }} size={40} />
           </>
         )}

         {/* Floating Points Feedback */}
         {showPoints && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-50 pointer-events-none">
              <div className="text-5xl font-bold text-green-500 animate-float-text drop-shadow-md whitespace-nowrap">
                +10 {combo > 2 && <span className="text-3xl text-yellow-500">連勝!</span>}
              </div>
            </div>
         )}

         {/* Bunny SVG */}
         <div className={`transition-transform duration-300 ${isPlaying ? 'scale-110' : 'group-hover:scale-105'}`}>
            <svg width="220" height="220" viewBox="0 0 200 200">
               {/* Glow behind */}
               <circle cx="100" cy="110" r="90" fill="url(#glow)" opacity="0.5" />
               <defs>
                 <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                   <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.6"/>
                   <stop offset="100%" stopColor="#FDBA74" stopOpacity="0"/>
                 </radialGradient>
               </defs>

               {/* Ears */}
               <ellipse cx="70" cy="60" rx="15" ry="50" fill="#fff" stroke="#eee" strokeWidth="2" transform="rotate(-10 70 60)" />
               <ellipse cx="70" cy="60" rx="8" ry="35" fill="#FFE4E6" transform="rotate(-10 70 60)" />
               
               <ellipse cx="130" cy="60" rx="15" ry="50" fill="#fff" stroke="#eee" strokeWidth="2" transform="rotate(10 130 60)" />
               <ellipse cx="130" cy="60" rx="8" ry="35" fill="#FFE4E6" transform="rotate(10 130 60)" />

               {/* Head */}
               <circle cx="100" cy="110" r="60" fill="#fff" stroke="#f0f0f0" strokeWidth="3" />
               
               {/* Face */}
               <circle cx="80" cy="100" r="5" fill="#333" /> {/* Left Eye */}
               <circle cx="120" cy="100" r="5" fill="#333" /> {/* Right Eye */}
               <path d="M90,115 Q100,125 110,115" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" /> {/* Mouth */}
               <circle cx="80" cy="118" r="7" fill="#FECACA" opacity="0.6" /> {/* Blush */}
               <circle cx="120" cy="118" r="7" fill="#FECACA" opacity="0.6" /> {/* Blush */}

               {/* Headphones */}
               <path d="M40,110 C40,50 160,50 160,110" fill="none" stroke="#60A5FA" strokeWidth="12" strokeLinecap="round" />
               <rect x="30" y="90" width="20" height="40" rx="10" fill="#3B82F6" />
               <rect x="150" y="90" width="20" height="40" rx="10" fill="#3B82F6" />
               
               {/* Play Icon on forehead/headphones or floating? Let's put a play hint if not playing */}
               {!isPlaying && (
                  <circle cx="100" cy="110" r="20" fill="rgba(0,0,0,0.05)" />
               )}
            </svg>
            
            {!isPlaying && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <Play className="text-orange-400 opacity-50" size={40} fill="currentColor" />
               </div>
            )}
         </div>
         <p className="text-center text-gray-500 font-bold mt-2 animate-pulse">點擊兔子聽聲音！</p>
      </div>

      {/* Answer Pads */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {['b', 'p', 'm', 'f'].map((sound) => (
          <button
            key={sound}
            onClick={() => checkAnswer(sound)}
            className={`
              relative overflow-hidden group p-8 rounded-3xl shadow-xl transition-all transform
              flex items-center justify-center border-b-8 active:border-b-0 active:translate-y-2
              ${sound === 'b' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600' : ''}
              ${sound === 'p' ? 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-600' : ''}
              ${sound === 'm' ? 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-600' : ''}
              ${sound === 'f' ? 'bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-600' : ''}
              ${feedback === 'wrong' ? 'animate-shake opacity-50' : ''}
            `}
          >
             <span className="text-6xl font-black drop-shadow-sm relative z-10">{sound}</span>
             
             {/* Decorative pattern */}
             <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-current opacity-10 group-hover:scale-150 transition-transform"></div>
             
             {/* Correct indicator */}
             {feedback === 'correct' && currentQ.initial === sound && (
                <div className="absolute inset-0 bg-yellow-400/20 z-20 flex items-center justify-center animate-pop">
                    <Star size={48} className="text-yellow-500 fill-yellow-500" />
                </div>
             )}
          </button>
        ))}
      </div>
    </div>
  );
};
