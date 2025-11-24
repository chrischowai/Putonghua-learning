import React, { useState, useEffect } from 'react';
import { Menu } from './components/Menu';
import { ToneCatcher } from './components/games/ToneCatcher';
import { VocabBridge } from './components/games/VocabBridge';
import { PinyinMatch } from './components/games/PinyinMatch';
import { InitialsListen } from './components/games/InitialsListen';
import { FishingGame } from './components/games/FishingGame';
import { SortingGame } from './components/games/SortingGame';
import { RhymeTrain } from './components/games/RhymeTrain';
import { WordPuzzle } from './components/games/WordPuzzle';
import { Library } from './components/Library';
import { GameType } from './types';
import { Trophy, Star, PartyPopper } from 'lucide-react';
import { playSoundEffect } from './services/audioService';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameType>(GameType.MENU);
  const [score, setScore] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  // Calculate level based on score (every 50 points is a level)
  useEffect(() => {
    const newLevel = Math.floor(score / 50) + 1;
    if (newLevel > currentLevel) {
      setCurrentLevel(newLevel);
      setShowLevelUp(true);
      playSoundEffect('correct');
      setTimeout(() => setShowLevelUp(false), 4000);
    }
  }, [score, currentLevel]);

  const handleScoreUpdate = (points: number) => {
    setScore(prev => prev + points);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case GameType.TONE_CATCHER:
        return <ToneCatcher onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.VOCAB_BRIDGE:
        return <VocabBridge onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.PINYIN_MATCH:
        return <PinyinMatch onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.INITIALS_LISTEN:
        return <InitialsListen onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.FISHING:
        return <FishingGame onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.SORTING:
        return <SortingGame onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.RHYME_TRAIN:
        return <RhymeTrain onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.WORD_PUZZLE:
        return <WordPuzzle onBack={() => setCurrentScreen(GameType.MENU)} onScoreUpdate={handleScoreUpdate} />;
      case GameType.LIBRARY:
        return <Library onBack={() => setCurrentScreen(GameType.MENU)} />;
      case GameType.MENU:
      default:
        return <Menu onSelectGame={setCurrentScreen} score={score} />;
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 py-4 px-4 font-sans select-none overflow-x-hidden">
       {/* Background decoration */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="fixed top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Level Up Overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-pop">
             <PartyPopper size={64} className="text-yellow-500 mb-4 animate-bounce" />
             <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
               升級了！
             </h2>
             <p className="text-2xl font-bold text-gray-700">你現在是等級 {currentLevel}</p>
             <div className="flex gap-2 mt-4">
               {[...Array(3)].map((_, i) => (
                 <Star key={i} className="text-yellow-400 fill-yellow-400 animate-pulse" size={32} />
               ))}
             </div>
          </div>
        </div>
      )}

      {/* Global Score HUD (visible in games) */}
      {currentScreen !== GameType.MENU && currentScreen !== GameType.LIBRARY && (
        <div className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg border border-yellow-200 flex items-center gap-3">
           <div className="flex items-center gap-1">
             <Trophy size={20} className="text-yellow-500" />
             <span className="font-bold text-gray-700">等級 {currentLevel}</span>
           </div>
           <div className="w-px h-6 bg-gray-200"></div>
           <div className="flex items-center gap-1">
             <Star size={20} className="text-yellow-400 fill-yellow-400" />
             <span className="font-bold text-gray-700">{score}</span>
           </div>
        </div>
      )}

      <div className="relative z-10 pt-2">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;