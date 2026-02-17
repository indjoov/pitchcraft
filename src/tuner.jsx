import { useState, useEffect, useRef, useCallback } from "react";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const INSTRUMENTS = [
  {
    id: "guitar",
    name: "Guitar",
    emoji: "🎸",
    tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
    color: "#FF6B35",
    description: "Standard 6-string tuning",
    strings: 6,
  },
  {
    id: "bass",
    name: "Bass",
    emoji: "🎸",
    tuning: ["E1", "A1", "D2", "G2"],
    color: "#7B2FF7",
    description: "Standard 4-string tuning",
    strings: 4,
  },
  {
    id: "ukulele",
    name: "Ukulele",
    emoji: "🪕",
    tuning: ["G4", "C4", "E4", "A4"],
    color: "#00C9A7",
    description: "Standard GCEA tuning",
    strings: 4,
  },
  {
    id: "violin",
    name: "Violin",
    emoji: "🎻",
    tuning: ["G3", "D4", "A4", "E5"],
    color: "#C4375B",
    description: "Standard tuning",
    strings: 4,
  },
  {
    id: "cello",
    name: "Cello",
    emoji: "🎻",
    tuning: ["C2", "G2", "D3", "A3"],
    color: "#E8871E",
    description: "Standard tuning",
    strings: 4,
  },
  {
    id: "banjo",
    name: "Banjo",
    emoji: "🪕",
    tuning: ["G4", "D3", "G3", "B3", "D4"],
    color: "#2D9CDB",
    description: "Open G tuning",
    strings: 5,
  },
  {
    id: "mandolin",
    name: "Mandolin",
    emoji: "🪕",
    tuning: ["G3", "D4", "A4", "E5"],
    color: "#F2C94C",
    description: "Standard tuning",
    strings: 4,
  },
  {
    id: "chromatic",
    name: "Chromatic",
    emoji: "🎵",
    tuning: [],
    color: "#56CCF2",
    description: "All notes, any instrument",
    strings: 0,
  },
];

const NOTE_FREQUENCIES = {};
for (let octave = 0; octave <= 8; octave++) {
  NOTES.forEach((note, i) => {
    const noteNum = octave * 12 + i - 9;
    NOTE_FREQUENCIES[`${note}${octave}`] = 440 * Math.pow(2, (noteNum - 49) / 12);
  });
}

function getClosestNote(freq) {
  if (!freq || freq < 20 || freq > 5000) return null;
  const noteNum = 12 * (Math.log2(freq / 440)) + 49;
  const rounded = Math.round(noteNum);
  const cents = Math.round((noteNum - rounded) * 100);
  const octave = Math.floor((rounded + 8) / 12);
  const noteIndex = ((rounded + 8) % 12 + 12) % 12;
  return {
    note: NOTES[noteIndex],
    octave,
    cents,
    frequency: freq,
    fullNote: `${NOTES[noteIndex]}${octave}`,
  };
}

// SVG Instrument Illustrations
function GuitarSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="guit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect x="54" y="5" width="12" height="55" rx="3" fill={color} opacity="0.7" />
      <line x1="57" y1="5" x2="57" y2="60" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      <line x1="60" y1="5" x2="60" y2="60" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      <line x1="63" y1="5" x2="63" y2="60" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      {/* Frets */}
      {[15, 25, 35, 45].map((y) => (
        <line key={y} x1="54" y1={y} x2="66" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      {/* Headstock */}
      <rect x="50" y="2" width="20" height="8" rx="3" fill={color} opacity="0.8" />
      <circle cx="53" cy="5" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="67" cy="5" r="1.5" fill="#fff" opacity="0.6" />
      {/* Body */}
      <ellipse cx="60" cy="78" rx="28" ry="22" fill="url(#guit-grad)" />
      <ellipse cx="60" cy="98" rx="32" ry="20" fill="url(#guit-grad)" />
      {/* Sound hole */}
      <circle cx="60" cy="82" r="10" fill="rgba(0,0,0,0.3)" />
      <circle cx="60" cy="82" r="11" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Bridge */}
      <rect x="52" y="100" width="16" height="3" rx="1" fill={color} opacity="0.8" />
      {/* Strings on body */}
      {[55, 57, 59, 61, 63, 65].map((x) => (
        <line key={x} x1={x} y1="60" x2={x} y2="100" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
    </svg>
  );
}

function BassSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="55" y="3" width="10" height="60" rx="2" fill={color} opacity="0.7" />
      <rect x="51" y="0" width="18" height="8" rx="3" fill={color} opacity="0.8" />
      <circle cx="54" cy="4" r="2" fill="#fff" opacity="0.5" />
      <circle cx="66" cy="4" r="2" fill="#fff" opacity="0.5" />
      {[18, 30, 42, 52].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      <path d="M35 70 Q30 85 38 100 Q48 115 60 115 Q72 115 82 100 Q90 85 85 70 Q82 62 60 62 Q38 62 35 70Z" fill="url(#bass-grad)" />
      <ellipse cx="50" cy="82" rx="6" ry="8" fill="rgba(0,0,0,0.25)" />
      <ellipse cx="70" cy="82" rx="6" ry="8" fill="rgba(0,0,0,0.25)" />
      <rect x="54" y="98" width="12" height="3" rx="1" fill={color} opacity="0.8" />
      {[57, 59, 61, 63].map((x) => (
        <line key={x} x1={x} y1="62" x2={x} y2="98" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
      ))}
    </svg>
  );
}

function UkuleleSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="uke-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="55" y="8" width="10" height="42" rx="3" fill={color} opacity="0.7" />
      <rect x="52" y="4" width="16" height="9" rx="4" fill={color} opacity="0.8" />
      <circle cx="55" cy="8" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="8" r="1.5" fill="#fff" opacity="0.5" />
      {[18, 28, 38].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      <ellipse cx="60" cy="72" rx="30" ry="28" fill="url(#uke-grad)" />
      <ellipse cx="60" cy="78" rx="28" ry="25" fill="url(#uke-grad)" />
      <circle cx="60" cy="72" r="12" fill="rgba(0,0,0,0.3)" />
      <circle cx="60" cy="72" r="13" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <rect x="54" y="94" width="12" height="2.5" rx="1" fill={color} opacity="0.8" />
      {[57, 59, 61, 63].map((x) => (
        <line key={x} x1={x} y1="50" x2={x} y2="94" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
    </svg>
  );
}

function ViolinSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="viol-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="57" y="3" width="6" height="38" rx="2" fill={color} opacity="0.7" />
      <rect x="53" y="0" width="14" height="7" rx="3" fill={color} opacity="0.8" />
      <circle cx="56" cy="3" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="64" cy="3" r="1.5" fill="#fff" opacity="0.5" />
      {/* Upper bout */}
      <ellipse cx="60" cy="52" rx="22" ry="16" fill="url(#viol-grad)" />
      {/* C-bout (waist) */}
      <ellipse cx="60" cy="68" rx="14" ry="8" fill="#0d0d12" />
      <ellipse cx="60" cy="68" rx="16" ry="9" fill="url(#viol-grad)" />
      {/* Lower bout */}
      <ellipse cx="60" cy="85" rx="26" ry="20" fill="url(#viol-grad)" />
      {/* F-holes */}
      <path d="M48 62 Q46 68 48 74" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" fill="none" />
      <path d="M72 62 Q74 68 72 74" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" fill="none" />
      {/* Tailpiece */}
      <rect x="56" y="96" width="8" height="10" rx="2" fill={color} opacity="0.8" />
      {/* Chin rest */}
      <ellipse cx="72" cy="100" rx="8" ry="6" fill={color} opacity="0.5" />
      {/* Strings */}
      {[57, 59, 61, 63].map((x) => (
        <line key={x} x1={x} y1="40" x2={x} y2="96" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
      {/* Bridge */}
      <rect x="54" y="78" width="12" height="2" rx="0.5" fill={color} opacity="0.9" />
    </svg>
  );
}

function CelloSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cello-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect x="56" y="3" width="8" height="30" rx="2" fill={color} opacity="0.7" />
      {/* Scroll */}
      <path d="M56 5 Q52 0 55 -2 Q58 -3 60 0" stroke={color} strokeWidth="2" fill="none" opacity="0.8" />
      {/* Pegs */}
      <circle cx="55" cy="8" r="2" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="8" r="2" fill="#fff" opacity="0.5" />
      {/* Upper bout */}
      <ellipse cx="60" cy="42" rx="24" ry="14" fill="url(#cello-grad)" />
      {/* Waist */}
      <ellipse cx="60" cy="56" rx="16" ry="7" fill="#0d0d12" />
      <ellipse cx="60" cy="56" rx="18" ry="8" fill="url(#cello-grad)" />
      {/* Lower bout */}
      <ellipse cx="60" cy="75" rx="30" ry="22" fill="url(#cello-grad)" />
      {/* F-holes */}
      <path d="M46 50 Q44 56 46 62" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" />
      <path d="M74 50 Q76 56 74 62" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" />
      {/* Tailpiece */}
      <rect x="55" y="88" width="10" height="12" rx="2" fill={color} opacity="0.8" />
      {/* Endpin */}
      <line x1="60" y1="100" x2="60" y2="118" stroke={color} strokeWidth="2" opacity="0.6" />
      <circle cx="60" cy="118" r="2" fill={color} opacity="0.8" />
      {/* Strings */}
      {[56, 58.5, 61.5, 64].map((x) => (
        <line key={x} x1={x} y1="33" x2={x} y2="88" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
      ))}
      <rect x="53" y="66" width="14" height="2.5" rx="0.5" fill={color} opacity="0.9" />
    </svg>
  );
}

function BanjoSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="banjo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect x="55" y="5" width="10" height="50" rx="2" fill={color} opacity="0.7" />
      {/* Headstock */}
      <rect x="52" y="0" width="16" height="10" rx="3" fill={color} opacity="0.8" />
      <circle cx="55" cy="4" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="4" r="1.5" fill="#fff" opacity="0.5" />
      {/* Frets */}
      {[18, 28, 38, 46].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      {/* Pot (drum body) - circular */}
      <circle cx="60" cy="82" r="32" fill="url(#banjo-grad)" />
      <circle cx="60" cy="82" r="30" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="60" cy="82" r="27" stroke={color} strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Membrane pattern */}
      <circle cx="60" cy="82" r="22" fill="rgba(255,255,255,0.05)" />
      {/* Bridge */}
      <rect x="54" y="82" width="12" height="3" rx="1" fill={color} opacity="0.9" />
      {/* Tailpiece */}
      <rect x="56" y="108" width="8" height="4" rx="1" fill={color} opacity="0.7" />
      {/* Strings */}
      {[56, 58, 60, 62, 64].map((x) => (
        <line key={x} x1={x} y1="55" x2={x} y2="108" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
      {/* 5th string peg */}
      <circle cx="55" cy="30" r="1.5" fill="#fff" opacity="0.5" />
    </svg>
  );
}

function MandolinSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mando-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="55" y="5" width="10" height="40" rx="3" fill={color} opacity="0.7" />
      <rect x="52" y="2" width="16" height="8" rx="3" fill={color} opacity="0.8" />
      <circle cx="55" cy="5" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="5" r="1.5" fill="#fff" opacity="0.5" />
      {[15, 22, 29, 36].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      {/* Teardrop body */}
      <ellipse cx="60" cy="68" rx="28" ry="22" fill="url(#mando-grad)" />
      <path d="M40 78 Q50 110 60 112 Q70 110 80 78" fill="url(#mando-grad)" />
      {/* Sound hole */}
      <ellipse cx="60" cy="65" rx="8" ry="6" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="60" cy="65" rx="9" ry="7" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
      {/* Bridge */}
      <rect x="53" y="82" width="14" height="2.5" rx="1" fill={color} opacity="0.9" />
      {/* Tailpiece */}
      <rect x="56" y="100" width="8" height="5" rx="1.5" fill={color} opacity="0.7" />
      {/* Strings (paired) */}
      {[56, 58, 62, 64].map((x) => (
        <line key={x} x1={x} y1="45" x2={x} y2="100" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
    </svg>
  );
}

function ChromaticSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="chrom-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Tuning fork */}
      <rect x="58" y="55" width="4" height="45" rx="2" fill={color} opacity="0.7" />
      <path d="M50 15 Q50 55 58 55" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M70 15 Q70 55 62 55" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Sound waves */}
      <path d="M38 25 Q32 35 38 45" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M32 20 Q24 35 32 50" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2" />
      <path d="M82 25 Q88 35 82 45" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M88 20 Q96 35 88 50" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2" />
      {/* Musical notes */}
      <circle cx="30" cy="70" r="4" fill={color} opacity="0.3" />
      <line x1="34" y1="55" x2="34" y2="70" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="90" cy="65" r="4" fill={color} opacity="0.3" />
      <line x1="94" y1="50" x2="94" y2="65" stroke={color} strokeWidth="1.5" opacity="0.3" />
      {/* Base */}
      <circle cx="60" cy="105" r="6" fill="url(#chrom-grad)" />
    </svg>
  );
}

const InstrumentSVGs = {
  guitar: GuitarSVG,
  bass: BassSVG,
  ukulele: UkuleleSVG,
  violin: ViolinSVG,
  cello: CelloSVG,
  banjo: BanjoSVG,
  mandolin: MandolinSVG,
  chromatic: ChromaticSVG,
};

// Accessibility: High contrast mode colors
const themes = {
  default: {
    bg: "#0d0d12",
    surface: "#16161f",
    surfaceAlt: "#1e1e2a",
    text: "#f0f0f5",
    textMuted: "#8888a0",
    border: "#2a2a3a",
  },
  highContrast: {
    bg: "#000000",
    surface: "#1a1a1a",
    surfaceAlt: "#2a2a2a",
    text: "#ffffff",
    textMuted: "#cccccc",
    border: "#ffffff",
  },
};

export default function ChromaticTuner() {
  const [selectedInstrument, setSelectedInstrument] = useState(INSTRUMENTS[0]);
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [referenceA, setReferenceA] = useState(440);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [selectedString, setSelectedString] = useState(null);
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const theme = highContrast ? themes.highContrast : themes.default;
  const textScale = largeText ? 1.25 : 1;
  const transition = reducedMotion ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  const autoCorrelate = useCallback((buf, sampleRate) => {
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = size - 1;
    const thresh = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buf[i]) < thresh) { r1 = i; break; }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buf[size - i]) < thresh) { r2 = size - i; break; }
    }

    buf = buf.slice(r1, r2);
    size = buf.length;

    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        c[i] += buf[j] * buf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;

    let maxVal = -1, maxPos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
    }

    let t0 = maxPos;
    const x1 = c[t0 - 1], x2 = c[t0], x3 = c[t0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) t0 = t0 - b / (2 * a);

    return sampleRate / t0;
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);

      const detect = () => {
        const buf = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buf);

        let rms = 0;
        for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
        rms = Math.sqrt(rms / buf.length);
        setVolume(Math.min(rms * 5, 1));

        const freq = autoCorrelate(buf, audioContext.sampleRate);
        if (freq > 0) {
          const noteInfo = getClosestNote(freq);
          if (noteInfo) setDetectedNote(noteInfo);
        }

        animFrameRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, [autoCorrelate]);

  const stopListening = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
    setDetectedNote(null);
    setVolume(0);
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  // Play reference tone
  const playTone = useCallback((freq) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }, []);

  const getNoteFrequency = (noteStr) => {
    const note = noteStr.replace(/[0-9]/g, "");
    const octave = parseInt(noteStr.replace(/[^0-9]/g, ""));
    const noteIndex = NOTES.indexOf(note);
    const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
    return referenceA * Math.pow(2, semitonesFromA4 / 12);
  };

  const getCentsColor = (cents) => {
    if (!cents && cents !== 0) return theme.textMuted;
    const abs = Math.abs(cents);
    if (abs <= 5) return "#22c55e";
    if (abs <= 15) return "#eab308";
    return "#ef4444";
  };

  const getCentsLabel = (cents) => {
    if (!cents && cents !== 0) return "";
    const abs = Math.abs(cents);
    if (abs <= 5) return "In Tune!";
    if (abs <= 15) return "Almost";
    return cents > 0 ? "Too Sharp" : "Too Flat";
  };

  const InstrumentIcon = InstrumentSVGs[selectedInstrument.id];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
        fontSize: `${14 * textScale}px`,
        transition,
        overflow: "auto",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.border}`,
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${selectedInstrument.color}, ${selectedInstrument.color}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition,
            }}
            aria-hidden="true"
          >
            ♪
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: `${18 * textScale}px`,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              PitchCraft
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: `${11 * textScale}px`,
                color: theme.textMuted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Open Source Chromatic Tuner
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Reference pitch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: theme.surfaceAlt,
              borderRadius: "8px",
              padding: "6px 12px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <label
              htmlFor="ref-pitch"
              style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted }}
            >
              A4
            </label>
            <select
              id="ref-pitch"
              value={referenceA}
              onChange={(e) => setReferenceA(Number(e.target.value))}
              aria-label="Reference pitch for A4"
              style={{
                background: "transparent",
                border: "none",
                color: theme.text,
                fontSize: `${13 * textScale}px`,
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {[432, 435, 438, 440, 442, 444].map((hz) => (
                <option key={hz} value={hz} style={{ background: theme.surface }}>
                  {hz} Hz
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility toggle */}
          <button
            onClick={() => setShowAccessibility(!showAccessibility)}
            aria-label="Accessibility settings"
            aria-expanded={showAccessibility}
            style={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              background: showAccessibility ? selectedInstrument.color + "22" : theme.surfaceAlt,
              color: showAccessibility ? selectedInstrument.color : theme.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${18 * textScale}px`,
              transition,
            }}
          >
            ♿
          </button>
        </div>
      </header>

      {/* Accessibility Panel */}
      {showAccessibility && (
        <div
          role="region"
          aria-label="Accessibility settings"
          style={{
            padding: "16px 24px",
            background: theme.surfaceAlt,
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: `${12 * textScale}px`,
              color: theme.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            Accessibility
          </span>
          {[
            { label: "High Contrast", state: highContrast, setter: setHighContrast },
            { label: "Reduced Motion", state: reducedMotion, setter: setReducedMotion },
            { label: "Large Text", state: largeText, setter: setLargeText },
          ].map(({ label, state, setter }) => (
            <button
              key={label}
              onClick={() => setter(!state)}
              role="switch"
              aria-checked={state}
              aria-label={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: `1px solid ${state ? selectedInstrument.color : theme.border}`,
                background: state ? selectedInstrument.color + "22" : "transparent",
                color: state ? selectedInstrument.color : theme.text,
                cursor: "pointer",
                fontSize: `${13 * textScale}px`,
                fontFamily: "inherit",
                transition,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  border: `2px solid ${state ? selectedInstrument.color : theme.textMuted}`,
                  background: state ? selectedInstrument.color : "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition,
                }}
              >
                {state && (
                  <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>✓</span>
                )}
              </span>
              {label}
            </button>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px" }}>
        {/* Instrument Selector */}
        <section aria-label="Instrument selection">
          <h2 className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
            Select Instrument
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            {INSTRUMENTS.map((inst) => {
              const isActive = selectedInstrument.id === inst.id;
              const SVGComponent = InstrumentSVGs[inst.id];
              return (
                <button
                  key={inst.id}
                  onClick={() => {
                    setSelectedInstrument(inst);
                    setSelectedString(null);
                  }}
                  aria-pressed={isActive}
                  aria-label={`${inst.name}: ${inst.description}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 8px",
                    borderRadius: "14px",
                    border: `2px solid ${isActive ? inst.color : theme.border}`,
                    background: isActive ? inst.color + "15" : theme.surface,
                    color: isActive ? inst.color : theme.text,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: inst.color,
                        borderRadius: "2px 2px 0 0",
                      }}
                    />
                  )}
                  <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SVGComponent color={isActive ? inst.color : theme.textMuted} size={48} />
                  </div>
                  <span
                    style={{
                      fontSize: `${12 * textScale}px`,
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {inst.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Instrument Detail */}
        <section
          aria-label={`${selectedInstrument.name} details`}
          style={{
            background: theme.surface,
            borderRadius: "20px",
            border: `1px solid ${theme.border}`,
            padding: "28px",
            marginBottom: "24px",
            display: "flex",
            gap: "28px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: selectedInstrument.color + "10",
              borderRadius: "16px",
              padding: "12px",
              border: `1px solid ${selectedInstrument.color}22`,
              flexShrink: 0,
            }}
          >
            <InstrumentIcon color={selectedInstrument.color} size={100} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: `${22 * textScale}px`,
                fontWeight: 800,
                color: selectedInstrument.color,
                letterSpacing: "-0.02em",
              }}
            >
              {selectedInstrument.name}
            </h2>
            <p
              style={{
                margin: "0 0 16px 0",
                color: theme.textMuted,
                fontSize: `${13 * textScale}px`,
              }}
            >
              {selectedInstrument.description}
            </p>

            {/* String buttons */}
            {selectedInstrument.tuning.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {selectedInstrument.tuning.map((note, i) => {
                  const isSelected = selectedString === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedString(i);
                        playTone(getNoteFrequency(note));
                      }}
                      aria-label={`String ${i + 1}: ${note}. Click to hear reference tone`}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "10px",
                        border: `2px solid ${isSelected ? selectedInstrument.color : theme.border}`,
                        background: isSelected ? selectedInstrument.color + "25" : theme.surfaceAlt,
                        color: isSelected ? selectedInstrument.color : theme.text,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: `${14 * textScale}px`,
                        fontWeight: 700,
                        transition,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                        minWidth: 52,
                      }}
                    >
                      <span>{note}</span>
                      <span
                        style={{
                          fontSize: `${9 * textScale}px`,
                          color: theme.textMuted,
                          fontWeight: 400,
                        }}
                      >
                        {Math.round(getNoteFrequency(note))} Hz
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Tuner Display */}
        <section
          aria-label="Tuner display"
          aria-live="polite"
          style={{
            background: theme.surface,
            borderRadius: "20px",
            border: `1px solid ${theme.border}`,
            padding: "32px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          {/* Cents meter */}
          <div
            style={{
              position: "relative",
              height: 12,
              borderRadius: 6,
              background: theme.surfaceAlt,
              overflow: "hidden",
              marginBottom: "28px",
              border: `1px solid ${theme.border}`,
            }}
            role="meter"
            aria-label={detectedNote ? `Tuning: ${detectedNote.cents} cents ${detectedNote.cents > 0 ? "sharp" : "flat"}` : "Waiting for input"}
            aria-valuemin={-50}
            aria-valuemax={50}
            aria-valuenow={detectedNote ? detectedNote.cents : 0}
          >
            {/* Center marker */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 2,
                background: "#22c55e",
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            />
            {/* Green zone */}
            <div
              style={{
                position: "absolute",
                left: "45%",
                width: "10%",
                top: 0,
                bottom: 0,
                background: "#22c55e20",
                zIndex: 1,
              }}
            />
            {/* Indicator */}
            {detectedNote && (
              <div
                style={{
                  position: "absolute",
                  left: `${50 + detectedNote.cents}%`,
                  top: -2,
                  bottom: -2,
                  width: 8,
                  borderRadius: 4,
                  background: getCentsColor(detectedNote.cents),
                  transform: "translateX(-50%)",
                  transition: reducedMotion ? "none" : "left 0.1s ease",
                  zIndex: 3,
                  boxShadow: `0 0 12px ${getCentsColor(detectedNote.cents)}88`,
                }}
              />
            )}
            {/* Tick marks */}
            {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((tick) => (
              <div
                key={tick}
                style={{
                  position: "absolute",
                  left: `${50 + tick}%`,
                  top: tick === 0 ? 0 : "30%",
                  bottom: tick === 0 ? 0 : "30%",
                  width: 1,
                  background: theme.textMuted + "44",
                }}
              />
            ))}
          </div>

          {/* Detected Note */}
          <div style={{ marginBottom: "8px" }}>
            <span
              style={{
                fontSize: `${72 * textScale}px`,
                fontWeight: 900,
                color: detectedNote ? getCentsColor(detectedNote.cents) : theme.textMuted + "44",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                transition,
                textShadow: detectedNote
                  ? `0 0 40px ${getCentsColor(detectedNote.cents)}44`
                  : "none",
              }}
            >
              {detectedNote ? detectedNote.note : "—"}
            </span>
            <span
              style={{
                fontSize: `${28 * textScale}px`,
                color: theme.textMuted,
                fontWeight: 600,
                verticalAlign: "super",
              }}
            >
              {detectedNote ? detectedNote.octave : ""}
            </span>
          </div>

          {/* Frequency & Status */}
          <div style={{ marginBottom: "4px" }}>
            <span
              style={{
                fontSize: `${16 * textScale}px`,
                color: theme.textMuted,
                fontFamily: "inherit",
              }}
            >
              {detectedNote ? `${detectedNote.frequency.toFixed(1)} Hz` : "Play a note..."}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: `${14 * textScale}px`,
                fontWeight: 700,
                color: detectedNote ? getCentsColor(detectedNote.cents) : "transparent",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {detectedNote ? getCentsLabel(detectedNote.cents) : "."}
            </span>
            {detectedNote && (
              <span
                style={{
                  display: "block",
                  fontSize: `${12 * textScale}px`,
                  color: theme.textMuted,
                  marginTop: "4px",
                }}
              >
                {detectedNote.cents > 0 ? "+" : ""}
                {detectedNote.cents} cents
              </span>
            )}
          </div>

          {/* Volume indicator */}
          {isListening && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "3px",
                marginTop: "20px",
                alignItems: "flex-end",
                height: 20,
              }}
              aria-label={`Input volume: ${Math.round(volume * 100)}%`}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: `${Math.max(4, (i < volume * 12 ? (i + 1) / 12 : 0.15) * 20)}px`,
                    borderRadius: 2,
                    background:
                      i < volume * 12 ? selectedInstrument.color : theme.surfaceAlt,
                    transition: reducedMotion ? "none" : "height 0.1s, background 0.1s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Start/Stop Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? "Stop tuner" : "Start tuner — requires microphone access"}
            style={{
              marginTop: "28px",
              padding: "14px 40px",
              borderRadius: "14px",
              border: "none",
              background: isListening
                ? "#ef4444"
                : `linear-gradient(135deg, ${selectedInstrument.color}, ${selectedInstrument.color}cc)`,
              color: "#fff",
              fontSize: `${16 * textScale}px`,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
              letterSpacing: "0.04em",
              boxShadow: isListening
                ? "0 4px 24px #ef444444"
                : `0 4px 24px ${selectedInstrument.color}44`,
              transition,
            }}
          >
            {isListening ? "■  STOP" : "●  START TUNER"}
          </button>
        </section>

        {/* Quick Tips */}
        <section
          aria-label="Tips"
          style={{
            background: theme.surface,
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            padding: "20px 24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              fontSize: `${13 * textScale}px`,
              fontWeight: 700,
              color: theme.textMuted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            How to Use
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              { icon: "🎯", text: "Select your instrument or use Chromatic mode for any pitch" },
              { icon: "🎤", text: "Click Start Tuner and allow microphone access" },
              { icon: "🎵", text: "Play a note — the meter shows if you're sharp or flat" },
              { icon: "🔊", text: "Tap any string button to hear the correct reference tone" },
            ].map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  padding: "10px",
                  borderRadius: "10px",
                  background: theme.surfaceAlt,
                }}
              >
                <span style={{ fontSize: "20px", flexShrink: 0 }} aria-hidden="true">
                  {tip.icon}
                </span>
                <span
                  style={{
                    fontSize: `${12 * textScale}px`,
                    color: theme.textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {tip.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "20px 0 40px",
            color: theme.textMuted,
            fontSize: `${11 * textScale}px`,
            letterSpacing: "0.06em",
          }}
        >
          <p style={{ margin: 0 }}>
            PitchCraft — Open Source Chromatic Tuner · MIT License
          </p>
          <p style={{ margin: "6px 0 0", opacity: 0.6 }}>
            Built with accessibility in mind · Keyboard navigable · Screen reader compatible
          </p>
        </footer>
      </div>
    </div>
  );
}
