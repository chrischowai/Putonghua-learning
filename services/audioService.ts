// Promise to ensure voices are loaded before use
let voicesLoadedPromise: Promise<SpeechSynthesisVoice[]> | null = null;

const ensureVoicesLoaded = (): Promise<SpeechSynthesisVoice[]> => {
  if (voicesLoadedPromise) {
    return voicesLoadedPromise;
  }

  voicesLoadedPromise = new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Voices not loaded yet, wait for voiceschanged event
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      resolve(window.speechSynthesis.getVoices());
    });

    // Fallback timeout
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });

  return voicesLoadedPromise;
};

export const speak = async (text: string, rate: number = 0.8) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Browser does not support text-to-speech");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Wait for voices to be loaded (especially important on iOS)
  const voices = await ensureVoicesLoaded();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN'; // Mandarin Chinese
  utterance.rate = rate; // Slower for kids
  utterance.pitch = 1.1; // Slightly higher pitch for friendliness

  // Enhanced voice selection for iOS Putonghua support
  let selectedVoice = null;

  // First priority: Look for specific Putonghua/Mandarin voices
  const putonghuaVoices = voices.filter(v =>
    v.lang === 'zh-CN' ||
    v.lang === 'cmn-CN' ||
    v.name.toLowerCase().includes('mandarin') ||
    v.name.toLowerCase().includes('putonghua') ||
    (v.lang === 'zh' && v.name.toLowerCase().includes('china'))
  );

  if (putonghuaVoices.length > 0) {
    selectedVoice = putonghuaVoices[0];
    console.log('Selected Putonghua voice:', selectedVoice.name, selectedVoice.lang);
  } else {
    // Second priority: Look for any Chinese voice but prefer mainland China
    const chineseVoices = voices.filter(v =>
      v.lang.includes('zh-CN') ||
      v.lang.includes('zh') ||
      v.lang === 'cmn' ||
      v.name.toLowerCase().includes('chinese')
    );

    // Sort to prefer mainland China voices
    const sortedVoices = chineseVoices.sort((a, b) => {
      // Prefer zh-CN over other variants
      if (a.lang === 'zh-CN' && b.lang !== 'zh-CN') return -1;
      if (b.lang === 'zh-CN' && a.lang !== 'zh-CN') return 1;
      // Prefer voices with "China" or "Beijing" in name
      const aHasChina = a.name.toLowerCase().includes('china') || a.name.toLowerCase().includes('beijing');
      const bHasChina = b.name.toLowerCase().includes('china') || b.name.toLowerCase().includes('beijing');
      if (aHasChina && !bHasChina) return -1;
      if (!aHasChina && bHasChina) return 1;
      return 0;
    });

    if (sortedVoices.length > 0) {
      selectedVoice = sortedVoices[0];
      console.log('Selected Chinese voice:', selectedVoice.name, selectedVoice.lang);
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else {
    console.warn('No suitable Chinese voice found, using system default');
    // Force language to zh-CN even without specific voice
    utterance.lang = 'zh-CN';
  }

  window.speechSynthesis.speak(utterance);
};

// Backward compatibility function (synchronous)
export const speakSync = (text: string, rate: number = 0.8) => {
  speak(text, rate).catch(console.error);
};

export const playSoundEffect = (type: 'correct' | 'wrong' | 'pop') => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  if (type === 'correct') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  } else if (type === 'wrong') {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  } else {
    // Pop sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  }
};