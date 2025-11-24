export enum GameType {
  MENU = 'MENU',
  TONE_CATCHER = 'TONE_CATCHER',
  PINYIN_MATCH = 'PINYIN_MATCH',
  VOCAB_BRIDGE = 'VOCAB_BRIDGE',
  INITIALS_LISTEN = 'INITIALS_LISTEN',
  FISHING = 'FISHING',
  SORTING = 'SORTING',
  RHYME_TRAIN = 'RHYME_TRAIN',
  WORD_PUZZLE = 'WORD_PUZZLE',
  LIBRARY = 'LIBRARY'
}

export interface Vocabulary {
  id: string;
  char: string;
  pinyin: string;
  tone: number; // 1, 2, 3, 4, 5 (neutral)
  meaning?: string; // English
  cantonese?: string; // For the vocab mapping exercise
  initial?: string; // b, p, m, f etc
  final?: string; // a, o, e, i, u, ü, ai, ei, etc.
  source?: 'system' | 'user'; // Track where the word came from
}

export interface ToneQuestion {
  char: string;
  pinyin: string;
  correctTone: number;
}

export interface InitialQuestion {
  sound: string; // e.g., 'b', 'p', 'm', 'f'
  options: string[];
}

export interface WordPuzzleData {
  id: string;
  word: string;
  pinyin: string;
  meaning: string; // Cantonese/English hint
  chars: string[]; // The correct characters ['學', '校']
  distractors: string[]; // Extra chars to confuse ['生', '習']
  source?: 'system' | 'user';
}

export interface LibraryFile {
  id: string;
  name: string;
  type: 'image' | 'text' | 'pdf' | 'word';
  uploadDate: number;
  status: 'processing' | 'ready' | 'error';
  content?: string; // Raw text content
  previewUrl?: string; // For images
}