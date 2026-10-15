// XP-flavoured sound effects synthesized with the Web Audio API
// (no copyrighted audio files are shipped).

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

export function getAudio(): { ctx: AudioContext; master: GainNode } {
  if (!ctx || !master) {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioCtor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master };
}

export function setMuted(value: boolean) {
  muted = value;
  if (ctx && master) master.gain.setTargetAtTime(value ? 0 : 1, ctx.currentTime, 0.01);
}

export const midiToFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

interface ToneOptions {
  type?: OscillatorType;
  volume?: number;
  attack?: number;
}

function tone(midi: number, start: number, duration: number, opts: ToneOptions = {}) {
  if (muted) return;
  const { type = "sine", volume = 0.15, attack = 0.01 } = opts;
  const { ctx, master } = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.value = midiToFreq(midi);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function noise(start: number, duration: number, volume = 0.1) {
  if (muted) return;
  const { ctx, master } = getAudio();
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  gain.gain.value = volume;
  src.buffer = buffer;
  src.connect(filter).connect(gain).connect(master);
  src.start(ctx.currentTime + start);
}

export const sounds = {
  startup() {
    [51, 58, 63, 67, 70, 75].forEach((n, i) => {
      tone(n, i * 0.18, 2.6 - i * 0.2, { type: "triangle", volume: 0.09, attack: 0.15 });
      tone(n + 12, i * 0.18 + 0.05, 1.8 - i * 0.15, { volume: 0.04, attack: 0.2 });
    });
  },
  logon() {
    [67, 72, 76, 79].forEach((n, i) => tone(n, i * 0.09, 0.7, { type: "triangle", volume: 0.1 }));
  },
  logoff() {
    [79, 76, 72, 67].forEach((n, i) => tone(n, i * 0.1, 0.7, { type: "triangle", volume: 0.1 }));
  },
  shutdown() {
    [75, 70, 67, 63, 58, 51].forEach((n, i) =>
      tone(n, i * 0.2, 1.6, { type: "triangle", volume: 0.08, attack: 0.08 })
    );
  },
  click() {
    tone(96, 0, 0.03, { type: "square", volume: 0.025, attack: 0.001 });
  },
  open() {
    tone(84, 0, 0.08, { type: "sine", volume: 0.06, attack: 0.002 });
    tone(91, 0.04, 0.1, { type: "sine", volume: 0.05, attack: 0.002 });
  },
  ding() {
    tone(81, 0, 0.8, { volume: 0.14, attack: 0.003 });
    tone(88, 0, 0.6, { volume: 0.06, attack: 0.003 });
  },
  error() {
    tone(57, 0, 0.25, { type: "square", volume: 0.05 });
    tone(52, 0.13, 0.35, { type: "square", volume: 0.05 });
  },
  crumple() {
    noise(0, 0.35, 0.25);
    noise(0.18, 0.3, 0.18);
  },
  explode() {
    noise(0, 0.6, 0.4);
    tone(40, 0, 0.5, { type: "sawtooth", volume: 0.08 });
  },
  win() {
    [72, 76, 79, 84].forEach((n, i) => tone(n, i * 0.12, 0.4, { type: "square", volume: 0.04 }));
  },
};
