import { Vocabulary, WordPuzzleData } from './types';
import { libraryService } from './services/libraryService';

// --- MASTER DATABASE (SYSTEM) ---
export const SYSTEM_DB: Vocabulary[] = [
  // b
  { id: 'b1', char: '爸', pinyin: 'bà', tone: 4, initial: 'b', final: 'a' },
  { id: 'b2', char: '八', pinyin: 'bā', tone: 1, initial: 'b', final: 'a' },
  { id: 'b3', char: '布', pinyin: 'bù', tone: 4, initial: 'b', final: 'u' },
  { id: 'b4', char: '筆', pinyin: 'bǐ', tone: 3, initial: 'b', final: 'i' },
  { id: 'b5', char: '白', pinyin: 'bái', tone: 2, initial: 'b', final: 'ai' },
  { id: 'b6', char: '包', pinyin: 'bāo', tone: 1, initial: 'b', final: 'ao' },
  { id: 'b7', char: '本', pinyin: 'běn', tone: 3, initial: 'b', final: 'en' },
  { id: 'b8', char: '半', pinyin: 'bàn', tone: 4, initial: 'b', final: 'an' },
  
  // p
  { id: 'p1', char: '怕', pinyin: 'pà', tone: 4, initial: 'p', final: 'a' },
  { id: 'p2', char: '皮', pinyin: 'pí', tone: 2, initial: 'p', final: 'i' },
  { id: 'p3', char: '破', pinyin: 'pò', tone: 4, initial: 'p', final: 'o' },
  { id: 'p4', char: '跑', pinyin: 'pǎo', tone: 3, initial: 'p', final: 'ao' },
  { id: 'p5', char: '朋友', pinyin: 'péng you', tone: 2, initial: 'p', final: 'eng' }, 
  { id: 'p6', char: '平', pinyin: 'píng', tone: 2, initial: 'p', final: 'ing' },
  { id: 'p7', char: '爬', pinyin: 'pá', tone: 2, initial: 'p', final: 'a' },

  // m
  { id: 'm1', char: '媽', pinyin: 'mā', tone: 1, initial: 'm', final: 'a' },
  { id: 'm2', char: '麻', pinyin: 'má', tone: 2, initial: 'm', final: 'a' },
  { id: 'm3', char: '馬', pinyin: 'mǎ', tone: 3, initial: 'm', final: 'a' },
  { id: 'm4', char: '木', pinyin: 'mù', tone: 4, initial: 'm', final: 'u' },
  { id: 'm5', char: '米', pinyin: 'mǐ', tone: 3, initial: 'm', final: 'i' },
  { id: 'm6', char: '門', pinyin: 'mén', tone: 2, initial: 'm', final: 'en' },
  { id: 'm7', char: '買', pinyin: 'mǎi', tone: 3, initial: 'm', final: 'ai' },
  { id: 'm8', char: '貓', pinyin: 'māo', tone: 1, initial: 'm', final: 'ao' },
  { id: 'm9', char: '美', pinyin: 'měi', tone: 3, initial: 'm', final: 'ei' },

  // f
  { id: 'f1', char: '佛', pinyin: 'fó', tone: 2, initial: 'f', final: 'o' },
  { id: 'f2', char: '發', pinyin: 'fā', tone: 1, initial: 'f', final: 'a' },
  { id: 'f3', char: '飛', pinyin: 'fēi', tone: 1, initial: 'f', final: 'ei' },
  { id: 'f4', char: '風', pinyin: 'fēng', tone: 1, initial: 'f', final: 'eng' },
  { id: 'f5', char: '飯', pinyin: 'fàn', tone: 4, initial: 'f', final: 'an' },

  // d
  { id: 'd1', char: '大', pinyin: 'dà', tone: 4, initial: 'd', final: 'a' },
  { id: 'd2', char: '弟', pinyin: 'dì', tone: 4, initial: 'd', final: 'i' },
  { id: 'd3', char: '多', pinyin: 'duō', tone: 1, initial: 'd', final: 'uo' },
  { id: 'd4', char: '刀', pinyin: 'dāo', tone: 1, initial: 'd', final: 'ao' },
  { id: 'd5', char: '蛋', pinyin: 'dàn', tone: 4, initial: 'd', final: 'an' },
  { id: 'd6', char: '地', pinyin: 'dì', tone: 4, initial: 'd', final: 'i' },

  // t
  { id: 't1', char: '天', pinyin: 'tiān', tone: 1, initial: 't', final: 'ian' },
  { id: 't2', char: '土', pinyin: 'tǔ', tone: 3, initial: 't', final: 'u' },
  { id: 't3', char: '兔', pinyin: 'tù', tone: 4, initial: 't', final: 'u' },
  { id: 't4', char: '頭', pinyin: 'tóu', tone: 2, initial: 't', final: 'ou' },
  { id: 't5', char: '他', pinyin: 'tā', tone: 1, initial: 't', final: 'a' },
  { id: 't6', char: '通', pinyin: 'tōng', tone: 1, initial: 't', final: 'ong' },
  { id: 't7', char: '桶', pinyin: 'tǒng', tone: 3, initial: 't', final: 'ong' },

  // n & l
  { id: 'n1', char: '拿', pinyin: 'ná', tone: 2, initial: 'n', final: 'a' },
  { id: 'n2', char: '你', pinyin: 'nǐ', tone: 3, initial: 'n', final: 'i' },
  { id: 'n3', char: '男', pinyin: 'nán', tone: 2, initial: 'n', final: 'an' },
  { id: 'n4', char: '牛', pinyin: 'niú', tone: 2, initial: 'n', final: 'iu' },
  { id: 'l1', char: '樂', pinyin: 'lè', tone: 4, initial: 'l', final: 'e' },
  { id: 'l2', char: '拉', pinyin: 'lā', tone: 1, initial: 'l', final: 'a' },
  { id: 'l3', char: '來', pinyin: 'lái', tone: 2, initial: 'l', final: 'ai' },
  { id: 'l4', char: '禮', pinyin: 'lǐ', tone: 3, initial: 'l', final: 'i' },

  // g, k, h
  { id: 'g1', char: '哥', pinyin: 'gē', tone: 1, initial: 'g', final: 'e' },
  { id: 'g2', char: '狗', pinyin: 'gǒu', tone: 3, initial: 'g', final: 'ou' },
  { id: 'g3', char: '高', pinyin: 'gāo', tone: 1, initial: 'g', final: 'ao' },
  { id: 'k1', char: '開', pinyin: 'kāi', tone: 1, initial: 'k', final: 'ai' },
  { id: 'k2', char: '口', pinyin: 'kǒu', tone: 3, initial: 'k', final: 'ou' },
  { id: 'k3', char: '看', pinyin: 'kàn', tone: 4, initial: 'k', final: 'an' },
  { id: 'h1', char: '好', pinyin: 'hǎo', tone: 3, initial: 'h', final: 'ao' },
  { id: 'h2', char: '花', pinyin: 'huā', tone: 1, initial: 'h', final: 'ua' },
  { id: 'h3', char: '海', pinyin: 'hǎi', tone: 3, initial: 'h', final: 'ai' },
  { id: 'h4', char: '紅', pinyin: 'hóng', tone: 2, initial: 'h', final: 'ong' },
];

// --- DYNAMIC DATA ACCESS ---

// Use this function instead of accessing VOCABULARY_DB directly
export const getAllVocabulary = (): Vocabulary[] => {
  const userVocab = libraryService.getUserVocabulary();
  return [...SYSTEM_DB, ...userVocab];
};

// Kept for backward compatibility but mapped to the getter
export const VOCABULARY_DB = SYSTEM_DB; // Deprecated, but kept for type safety in existing code if needed

// Helper to get random items
const getRandomItems = (count: number, filterFn?: (v: Vocabulary) => boolean) => {
  const allVocab = getAllVocabulary();
  let filtered = allVocab;
  if (filterFn) {
    filtered = allVocab.filter(filterFn);
  }
  // Fallback if filter returns too few items, grab from system DB to ensure game works
  if (filtered.length < count) {
     filtered = [...filtered, ...SYSTEM_DB.filter(filterFn || (() => true))];
  }
  
  // Remove duplicates by ID
  const unique = Array.from(new Map(filtered.map(item => [item.id, item])).values());
  
  return [...unique].sort(() => Math.random() - 0.5).slice(0, count);
};

// --- DATA SET GETTERS ---

export const getToneData = () => getRandomItems(20);

export const getSortingData = () => {
    const all = getAllVocabulary();
    return all.filter(w => ['b', 'p', 'm', 'f'].includes(w.initial || ''));
};

export const getPinyinMatchData = () => getRandomItems(15);

// Word Puzzle Data needs to handle System + User generated compound words
// For now, we manually define system puzzles, but we could generate them from user 2-char words
export const WORD_PUZZLE_DATA: WordPuzzleData[] = [
  { id: 'w1', word: '學校', pinyin: 'xué xiào', meaning: '學校', chars: ['學', '校'], distractors: ['生', '教'] },
  { id: 'w2', word: '老師', pinyin: 'lǎo shī', meaning: '老師', chars: ['老', '師'], distractors: ['考', '帥'] },
  { id: 'w3', word: '同學', pinyin: 'tóng xué', meaning: '同學', chars: ['同', '學'], distractors: ['向', '字'] },
  { id: 'w4', word: '書包', pinyin: 'shū bāo', meaning: '書包', chars: ['書', '包'], distractors: ['筆', '跑'] },
  { id: 'w5', word: '鉛筆', pinyin: 'qiān bǐ', meaning: '鉛筆', chars: ['鉛', '筆'], distractors: ['錢', '比'] },
  { id: 'w6', word: '朋友', pinyin: 'péng you', meaning: '朋友', chars: ['朋', '友'], distractors: ['月', '有'] },
  { id: 'w7', word: '再見', pinyin: 'zài jiàn', meaning: '再見', chars: ['再', '見'], distractors: ['在', '現'] },
  { id: 'w8', word: '謝謝', pinyin: 'xiè xie', meaning: '謝謝', chars: ['謝', '謝'], distractors: ['射', '寫'] },
  { id: 'w9', word: '早上', pinyin: 'zǎo shang', meaning: '早上', chars: ['早', '上'], distractors: ['草', '下'] },
  { id: 'w10', word: '晚安', pinyin: 'wǎn ān', meaning: '晚安', chars: ['晚', '安'], distractors: ['免', '按'] },
  { id: 'w11', word: '喜歡', pinyin: 'xǐ huan', meaning: '喜歡', chars: ['喜', '歡'], distractors: ['嘻', '吹'] },
  { id: 'w12', word: '唱歌', pinyin: 'chàng gē', meaning: '唱歌', chars: ['唱', '歌'], distractors: ['喝', '哥'] },
  { id: 'w13', word: '讀書', pinyin: 'dú shū', meaning: '讀書', chars: ['讀', '書'], distractors: ['賣', '看'] },
  { id: 'w14', word: '寫字', pinyin: 'xiě zì', meaning: '寫字', chars: ['寫', '字'], distractors: ['家', '學'] },
  { id: 'w15', word: '畫畫', pinyin: 'huà huà', meaning: '畫畫', chars: ['畫', '畫'], distractors: ['田', '圖'] },
  { id: 'w16', word: '遊戲', pinyin: 'yóu xì', meaning: '遊戲', chars: ['遊', '戲'], distractors: ['游', '找'] },
  { id: 'w17', word: '操場', pinyin: 'cāo chǎng', meaning: '操場', chars: ['操', '場'], distractors: ['手', '地'] },
  { id: 'w18', word: '課本', pinyin: 'kè běn', meaning: '課本', chars: ['課', '本'], distractors: ['果', '木'] },
  { id: 'w19', word: '舉手', pinyin: 'jǔ shǒu', meaning: '舉手', chars: ['舉', '手'], distractors: ['興', '毛'] },
  { id: 'w20', word: '排隊', pinyin: 'pái duì', meaning: '排隊', chars: ['排', '隊'], distractors: ['非', '對'] },
];

// Helper to get puzzle data (future proofing)
export const getWordPuzzleData = () => {
  return WORD_PUZZLE_DATA;
};

// Need to update Rhyme Game to use getter
export const getRhymeData = () => {
  const all = getAllVocabulary();
  return {
    a: all.filter(w => w.final === 'a'),
    o: all.filter(w => w.final === 'o'),
    e: all.filter(w => w.final === 'e'),
    i: all.filter(w => w.final === 'i'),
    u: all.filter(w => w.final === 'u'),
    ai: all.filter(w => w.final === 'ai'),
    ei: all.filter(w => w.final === 'ei'),
    ao: all.filter(w => w.final === 'ao'),
    ou: all.filter(w => w.final === 'ou'),
  };
};

export const VOCAB_BRIDGE_DATA: Vocabulary[] = [
  { id: 'v1', char: '教室', pinyin: 'jiào shì', tone: 4, cantonese: '班房' },
  { id: 'v2', char: '板擦', pinyin: 'bǎn cā', tone: 3, cantonese: '粉擦' },
  { id: 'v3', char: '晚安', pinyin: 'wǎn ān', tone: 3, cantonese: '早唞' },
  { id: 'v4', char: '尺子', pinyin: 'chǐ zi', tone: 3, cantonese: '間尺' },
  { id: 'v5', char: '學校', pinyin: 'xué xiào', tone: 2, cantonese: '學校' },
  { id: 'v6', char: '橡皮', pinyin: 'xiàng pí', tone: 4, cantonese: '擦膠' },
  { id: 'v7', char: '鉛筆', pinyin: 'qiān bǐ', tone: 1, cantonese: '鉛筆' },
  { id: 'v8', char: '書包', pinyin: 'shū bāo', tone: 1, cantonese: '書包' },
];

// Re-export static data for games that haven't been fully refactored to use getters yet
// But we should try to use getters in the components
export const TONE_DATA = getRandomItems(20);
export const SORTING_DATA = SYSTEM_DB.filter(w => ['b', 'p', 'm', 'f'].includes(w.initial || ''));
export const PINYIN_MATCH_DATA = getRandomItems(15);
export const RHYME_GAME_DATA = getRhymeData();