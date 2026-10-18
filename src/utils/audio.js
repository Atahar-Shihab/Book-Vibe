// Audio Engine using Browser Web Audio API & Speech Synthesis
// Zero external mp3 dependencies - 100% self-contained & reliable

let audioCtx = null;
let ambientSource = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a crisp, natural page-flip paper rustle
 */
export function playPageFlipSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.15; // 150ms buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered pink-like paper noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain boost
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter to mimic paper friction frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Quick volume envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.debug("Page flip sound failed:", e);
  }
}

/**
 * Plays a crystalline success chime when books are added
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

      const startTime = ctx.currentTime + idx * 0.07;
      const duration = 0.35;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.debug("Chime failed:", e);
  }
}

/**
 * Procedural Ambient Soundscapes (Rain or Fireplace)
 */
export function startAmbientSound(type = "rain", volume = 0.25) {
  stopAmbientSound();

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === "rain") {
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.1;
      }
    } else {
      // Fireplace crackle & low rumble
      for (let i = 0; i < bufferSize; i++) {
        const crackle = Math.random() > 0.996 ? (Math.random() * 2 - 1) * 0.8 : 0;
        const rumble = (Math.random() * 2 - 1) * 0.05;
        data[i] = crackle + rumble;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = type === "rain" ? "lowpass" : "bandpass";
    filter.frequency.setValueAtTime(type === "rain" ? 1200 : 800, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    ambientSource = source;
  } catch (e) {
    console.debug("Ambient sound start error:", e);
  }
}

export function stopAmbientSound() {
  if (ambientSource) {
    try {
      ambientSource.stop();
      ambientSource.disconnect();
    } catch {
      // ignore
    }
    ambientSource = null;
  }
}

/**
 * Text-to-speech AI Narrator for Book Synopsis & Quotes
 */
export function speakText(text, onEnd) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Prefer high quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) => (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")) && v.lang.startsWith("en")
  );
  if (naturalVoice) utterance.voice = naturalVoice;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
