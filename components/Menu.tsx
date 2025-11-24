import React from 'react';
import { GameType } from '../types';
import { Music, Type, Languages, Ear, Fish, Mail, Star, Trophy, TrainFront, Construction, BookOpen } from 'lucide-react';

interface MenuProps {
  onSelectGame: (game: GameType) => void;
  score: number;
}

export const Menu: React.FC<MenuProps> = ({ onSelectGame, score }) => {
  const currentLevel = Math.floor(score / 50) + 1;
  const progressToNext = (score % 50) / 50 * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-6">
      <header className="mb-12 text-center relative w-full flex flex-col items-center">
        <h1 className="text-6xl font-bold text-sky-600 mb-4 tracking-wider bounce relative z-10 text-shadow-lg">
          拼音遊樂園
        </h1>
        <p className="text-xl text-gray-600 relative z-10 mb-8">一起快樂學普通話！</p>
        
        {/* Score Card */}
        <div className="relative z-10 bg-white p-6 rounded-3xl shadow-xl border-4 border-yellow-200 max-w-md w-full">
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                 <div className="bg-yellow-100 p-3 rounded-full">
                    <Trophy className="text-yellow-600" size={32} />
                 </div>
                 <div className="text-left">
                    <div className="text-sm text-gray-400 font-bold uppercase">目前等級</div>
                    <div className="text-3xl font-bold text-gray-800">{currentLevel}</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-sm text-gray-400 font-bold uppercase">獲得星星</div>
                 <div className="text-3xl font-bold text-yellow-500 flex items-center justify-end gap-1">
                    {score} <Star className="fill-yellow-500" size={24} />
                 </div>
              </div>
           </div>
           
           {/* Progress Bar */}
           <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressToNext}%` }}
              ></div>
           </div>
           <div className="flex justify-between text-xs text-gray-400 mt-1 font-bold">
              <span>等級 {currentLevel}</span>
              <span>等級 {currentLevel + 1}</span>
           </div>
        </div>
        
        {/* Decorative elements behind header */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-10 w-96 h-96 bg-white rounded-full opacity-50 filter blur-3xl -z-0"></div>
      </header>
      
      {/* Teacher's Desk / Library Button - Featured */}
      <button
        onClick={() => onSelectGame(GameType.LIBRARY)}
        className="w-full max-w-3xl mb-12 bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-between group"
      >
        <div className="flex items-center gap-6">
           <div className="bg-indigo-500 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
             <BookOpen size={40} />
           </div>
           <div className="text-left">
             <h2 className="text-2xl font-bold">字詞資料庫 (老師專區)</h2>
             <p className="text-indigo-200">上傳工作紙，自動識別文字，建立專屬詞庫！</p>
           </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
           <Music className="text-white rotate-45" size={24} />
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
        {/* Game 1: Tone Balloon Pop */}
        <button
          onClick={() => onSelectGame(GameType.TONE_CATCHER)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-sky-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-sky-400"></div>
          <div className="bg-sky-100 p-6 rounded-full mb-4 group-hover:bg-sky-200 transition-colors animate-pop">
            <Music size={48} className="text-sky-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">聲調氣球</h2>
          <p className="text-gray-500 text-sm mb-4">戳破正確聲調的氣球！</p>
          <div className="flex gap-2 opacity-60">
            <span className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-600 font-bold">1</span>
            <span className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600 font-bold">2</span>
          </div>
        </button>

        {/* Game 2: Vocab Bridge */}
        <button
          onClick={() => onSelectGame(GameType.VOCAB_BRIDGE)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-green-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-green-400"></div>
          <div className="bg-green-100 p-6 rounded-full mb-4 group-hover:bg-green-200 transition-colors animate-pop">
            <Languages size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">詞語橋樑</h2>
          <p className="text-gray-500 text-sm mb-4">將廣東話連接到普通話。</p>
          <div className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
            班房 ➜ 教室
          </div>
        </button>

        {/* Game 3: Pinyin Match */}
        <button
          onClick={() => onSelectGame(GameType.PINYIN_MATCH)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-purple-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-purple-400"></div>
          <div className="bg-purple-100 p-6 rounded-full mb-4 group-hover:bg-purple-200 transition-colors animate-pop">
            <Type size={48} className="text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">拼音配對</h2>
          <p className="text-gray-500 text-sm mb-4">找出圖片對應的拼音。</p>
          <div className="flex gap-1">
             <span className="text-purple-300 font-bold text-xl">b</span>
             <span className="text-purple-400 font-bold text-xl">p</span>
             <span className="text-purple-500 font-bold text-xl">m</span>
          </div>
        </button>

         {/* Game 4: Magic Ears */}
         <button
          onClick={() => onSelectGame(GameType.INITIALS_LISTEN)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-orange-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-400"></div>
          <div className="bg-orange-100 p-6 rounded-full mb-4 group-hover:bg-orange-200 transition-colors animate-pop">
            <Ear size={48} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">神奇耳朵</h2>
          <p className="text-gray-500 text-sm mb-4">聽一聽！是 b, p, m 還是 f？</p>
          <div className="w-16 h-1 bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-orange-400 animate-pulse"></div>
          </div>
        </button>

        {/* Game 5: Fishing Fun */}
        <button
          onClick={() => onSelectGame(GameType.FISHING)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-blue-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-400"></div>
          <div className="bg-blue-100 p-6 rounded-full mb-4 group-hover:bg-blue-200 transition-colors animate-pop">
            <Fish size={48} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">快樂釣魚</h2>
          <p className="text-gray-500 text-sm mb-4">釣起發音正確的魚！</p>
          <div className="flex gap-2">
             <Fish size={16} className="text-blue-300" />
             <Fish size={16} className="text-blue-400" />
             <Fish size={16} className="text-blue-500" />
          </div>
        </button>

        {/* Game 6: Sorting Station */}
        <button
          onClick={() => onSelectGame(GameType.SORTING)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-indigo-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-400"></div>
          <div className="bg-indigo-100 p-6 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors animate-pop">
            <Mail size={48} className="text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">分類郵局</h2>
          <p className="text-gray-500 text-sm mb-4">把信件投進正確的信箱。</p>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded border border-indigo-200"></div>
            <div className="w-8 h-8 bg-indigo-100 rounded border border-indigo-200"></div>
          </div>
        </button>

        {/* Game 7: Rhyme Train */}
        <button
          onClick={() => onSelectGame(GameType.RHYME_TRAIN)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-rose-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-rose-400"></div>
          <div className="bg-rose-100 p-6 rounded-full mb-4 group-hover:bg-rose-200 transition-colors animate-pop">
            <TrainFront size={48} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">韻母小火車</h2>
          <p className="text-gray-500 text-sm mb-4">將詞語裝上正確的韻母火車！</p>
          <div className="flex gap-1">
             <span className="bg-rose-100 px-2 rounded text-rose-500 text-xs font-bold">a</span>
             <span className="bg-rose-100 px-2 rounded text-rose-500 text-xs font-bold">o</span>
             <span className="bg-rose-100 px-2 rounded text-rose-500 text-xs font-bold">e</span>
          </div>
        </button>

        {/* Game 8: Word Architect (NEW) */}
        <button
          onClick={() => onSelectGame(GameType.WORD_PUZZLE)}
          className="group relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-amber-200 active:border-b-0 active:translate-y-0 flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
          <div className="bg-amber-100 p-6 rounded-full mb-4 group-hover:bg-amber-200 transition-colors animate-pop">
            <Construction size={48} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">詞語建築師</h2>
          <p className="text-gray-500 text-sm mb-4">組合字塊，建造正確的詞語！</p>
          <div className="flex gap-1">
             <div className="w-8 h-8 bg-amber-200 rounded flex items-center justify-center font-bold text-amber-700 text-xs">學</div>
             <div className="w-8 h-8 bg-amber-200 rounded flex items-center justify-center font-bold text-amber-700 text-xs">校</div>
          </div>
        </button>

      </div>
    </div>
  );
};