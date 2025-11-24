import { Vocabulary, LibraryFile } from '../types';

const STORAGE_KEY_VOCAB = 'pinyin_fun_user_vocab';
const STORAGE_KEY_FILES = 'pinyin_fun_user_files';

// Helper to detect initial/final/tone from pinyin string (simple heuristic)
const parsePinyin = (char: string, pinyinStr: string): Partial<Vocabulary> => {
  const tones: {[key: string]: number} = { 'ā':1, 'á':2, 'ǎ':3, 'à':4, 'ē':1, 'é':2, 'ě':3, 'è':4, 'ī':1, 'í':2, 'ǐ':3, 'ì':4, 'ō':1, 'ó':2, 'ǒ':3, 'ò':4, 'ū':1, 'ú':2, 'ǔ':3, 'ù':4, 'ǖ':1, 'ǘ':2, 'ǚ':3, 'ǜ':4 };
  
  let tone = 5;
  for (const tChar of Object.keys(tones)) {
    if (pinyinStr.includes(tChar)) {
      tone = tones[tChar];
      break;
    }
  }

  // Very basic initial extractor
  const initials = ['ch', 'sh', 'zh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'z', 'c', 's', 'r', 'y', 'w'];
  let initial = '';
  for (const ini of initials) {
    if (pinyinStr.startsWith(ini)) {
      initial = ini;
      break;
    }
  }

  return {
    char,
    pinyin: pinyinStr,
    tone,
    initial: initial || pinyinStr.charAt(0),
    final: pinyinStr.replace(initial, '').replace(/[1-5]/g, '').trim(), // Rough approximation
    source: 'user'
  };
};

export const libraryService = {
  // --- VOCABULARY MANAGEMENT ---
  getUserVocabulary: (): Vocabulary[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VOCAB);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load user vocab", e);
      return [];
    }
  },

  addUserVocabulary: (vocab: Vocabulary) => {
    const current = libraryService.getUserVocabulary();
    const updated = [...current, { ...vocab, id: `user-${Date.now()}`, source: 'user' as const }];
    localStorage.setItem(STORAGE_KEY_VOCAB, JSON.stringify(updated));
    return updated;
  },

  removeUserVocabulary: (id: string) => {
    const current = libraryService.getUserVocabulary();
    const updated = current.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY_VOCAB, JSON.stringify(updated));
    return updated;
  },

  // --- FILE MANAGEMENT ---
  getFiles: (): LibraryFile[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FILES);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  addFile: async (file: File): Promise<LibraryFile> => {
    const isImage = file.type.startsWith('image/');
    const isText = file.type === 'text/plain';
    
    // Create base file record
    const newFile: LibraryFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      type: isImage ? 'image' : isText ? 'text' : file.name.endsWith('.pdf') ? 'pdf' : 'word',
      uploadDate: Date.now(),
      status: 'processing',
    };

    // For image preview
    if (isImage) {
      newFile.previewUrl = URL.createObjectURL(file);
    }

    // Save initial state
    const files = libraryService.getFiles();
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify([...files, newFile]));

    return newFile;
  },

  updateFileStatus: (id: string, status: 'ready' | 'error', content?: string) => {
    const files = libraryService.getFiles();
    const updated = files.map(f => f.id === id ? { ...f, status, content } : f);
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updated));
  },

  deleteFile: (id: string) => {
    const files = libraryService.getFiles();
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files.filter(f => f.id !== id)));
  },

  // --- OCR / PROCESSING ---
  processFile: async (fileObj: LibraryFile, fileData: File): Promise<string> => {
    if (fileObj.type === 'image') {
      try {
        // @ts-ignore - Tesseract is loaded via CDN
        const { createWorker } = window.Tesseract;
        const worker = createWorker({
           logger: (m: any) => console.log(m)
        });
        
        await worker.load();
        await worker.loadLanguage('chi_tra+chi_sim'); // Traditional + Simplified
        await worker.initialize('chi_tra+chi_sim');
        
        const { data: { text } } = await worker.recognize(fileData);
        await worker.terminate();
        
        libraryService.updateFileStatus(fileObj.id, 'ready', text);
        return text;
      } catch (e) {
        console.error("OCR Failed", e);
        libraryService.updateFileStatus(fileObj.id, 'error');
        return "";
      }
    } else if (fileObj.type === 'text') {
       const text = await fileData.text();
       libraryService.updateFileStatus(fileObj.id, 'ready', text);
       return text;
    } else {
       // Simulate processing for PDF/Word
       return new Promise((resolve) => {
          setTimeout(() => {
             const mockText = "這是模擬的提取文字。因為瀏覽器限制，PDF和Word需要後端支持。請上傳圖片或TXT文件。";
             libraryService.updateFileStatus(fileObj.id, 'ready', mockText);
             resolve(mockText);
          }, 1500);
       });
    }
  },

  // Simple heuristic to extract potential vocab from raw text
  // This is a "dumb" extractor that just finds Chinese characters
  extractSuggestions: (text: string): Partial<Vocabulary>[] => {
     // Remove non-chinese, non-alphanumeric (keep pinyin-ish chars)
     // Regex to find Chinese characters: [\u4e00-\u9fa5]
     const regex = /([\u4e00-\u9fa5]+)/g;
     const matches = text.match(regex);
     if (!matches) return [];

     // Unique items, max 2 chars length for simplicity in this demo game context
     const unique = [...new Set(matches)].filter(m => m.length <= 2); 
     
     return unique.map(char => ({
        char,
        pinyin: '', // User needs to fill this
        tone: 5,
        meaning: '',
        source: 'user'
     }));
  }
};