import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStop, FaStepForward, FaStepBackward } from "react-icons/fa";
import { useSettings } from "../../context/useSettings";
import { getAudio, midiToFreq } from "../../lib/sounds";

// ---------------------------------------------------------------------------
// Tiny chiptune sequencer. Tracks are original compositions written as
// "NOTE:eighths" tokens ("-" is a rest, default length is one eighth note).
// ---------------------------------------------------------------------------

interface Track {
  title: string;
  bpm: number;
  melody: string;
  bass: string;
  /** Lead oscillator, square by default */
  lead?: OscillatorType;
  hats?: boolean;
  /** One-bar drum patterns in eighths: "x" = hit, "." = rest */
  kick?: string;
  snare?: string;
}

const TRACKS: Track[] = [
  {
    title: "Liv - Pixel Sunrise",
    bpm: 132,
    melody: "C5 E5 G5 E5 C6 G5 E5 G5 A4 C5 F5 C5 A5 F5 C5 F5 G4 B4 D5 B4 G5 D5 B4 D5 C5 E5 G5 C6 G5:2 -:2",
    bass: "C3:2 C3:2 G2:2 C3:2 F2:2 F2:2 C3:2 F2:2 G2:2 G2:2 D3:2 G2:2 C3:2 G2:2 C3:4",
  },
  {
    title: "Liv - Santos Beach Walk",
    bpm: 104,
    melody: "A4:2 C5 E5:2 D5 C5 B4 G4:2 B4 D5:2 C5 B4 A4 F4:2 A4 C5:2 B4 A4 G4 E4 G#4 B4 E5:3 -:2",
    bass: "A2:3 A2 E3:2 A2:2 G2:3 G2 D3:2 G2:2 F2:3 F2 C3:2 F2:2 E2:3 E2 B2:2 E2:2",
    hats: true,
  },
  {
    title: "Liv - Debugging at 3AM",
    bpm: 152,
    melody: "E5 E5 B4 E5 G5 F#5 E5 D5 C5 C5 G4 C5 E5 D5 C5 B4 A4 B4 C5 D5 E5 D5 C5 B4 B4 D#5 F#5 B5 A5:2 F#5:2",
    bass: "E2 E3 E2 E3 E2 E3 E2 E3 C2 C3 C2 C3 C2 C3 C2 C3 A1 A2 A1 A2 A1 A2 A1 A2 B1 B2 B1 B2 B1 B2 B1 B2",
    hats: true,
  },
  {
    // k-pop dance-pop energy: minor key, octave bass, four-on-the-floor
    title: "Liv - Neon Seoul Nights",
    bpm: 124,
    melody: "F#5:2 F#5 E5 D5:2 B4:2 D5 E5 G5:2 F#5 E5 D5 E5 F#5:2 A5 F#5 E5:2 D5 C#5 E5:3 D5 C#5:2 -:2",
    bass: "B1 B2 B1 B2 B1 B2 B1 B2 G1 G2 G1 G2 G1 G2 G1 G2 D2 D3 D2 D3 D2 D3 D2 D3 A1 A2 A1 A2 A1 A2 A1 A2",
    hats: true,
    kick: "x.x.x.x.",
    snare: "..x...x.",
  },
  {
    // Dreamy bedroom-pop lead over a 2-step UK garage beat
    title: "Liv - Bedroom Garage",
    bpm: 136,
    melody: "A5:3 G5 F5:2 D5:2 F5:2 G5 A5 G5:4 C6:2 A5 G5 F5:2 G5 A5 G5:6 -:2",
    bass: "D2:3 D2 -:2 D3 D2 A#1:3 A#1 -:2 A#2 A#1 F2:3 F2 -:2 F3 F2 C2:3 C2 -:2 C3 C2",
    lead: "triangle",
    hats: true,
    kick: "x....x..",
    snare: "..x...x.",
  },
];

const SPOTIFY_EMBED = "https://open.spotify.com/embed/playlist/22Y9LQwUv2qFmjZKglWUrd?utm_source=generator&theme=0";

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

interface NoteEvent {
  midi: number | null;
  start: number; // in eighths
  length: number; // in eighths
}

function parse(sequence: string): { events: NoteEvent[]; total: number } {
  let cursor = 0;
  const events = sequence.split(/\s+/).map((token) => {
    const [name, len] = token.split(":");
    const length = len ? Number(len) : 1;
    const match = /^([A-G])(#|b)?(-?\d)$/.exec(name);
    const midi = match
      ? 12 * (Number(match[3]) + 1) + SEMITONES[match[1]] + (match[2] === "#" ? 1 : match[2] === "b" ? -1 : 0)
      : null;
    const event = { midi, start: cursor, length };
    cursor += length;
    return event;
  });
  return { events, total: cursor };
}

function scheduleNote(ctx: AudioContext, out: AudioNode, midi: number, time: number, duration: number, type: OscillatorType, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = midiToFreq(midi);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.95);
  osc.connect(gain).connect(out);
  osc.start(time);
  osc.stop(time + duration);
}

function scheduleKick(ctx: AudioContext, out: AudioNode, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  osc.connect(gain).connect(out);
  osc.start(time);
  osc.stop(time + 0.2);
}

function scheduleSnare(ctx: AudioContext, out: AudioNode, time: number, noise: AudioBuffer) {
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  src.buffer = noise;
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  gain.gain.setValueAtTime(0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
  src.connect(filter).connect(gain).connect(out);
  src.start(time);
  src.stop(time + 0.11);
}

function scheduleHat(ctx: AudioContext, out: AudioNode, time: number, noise: AudioBuffer) {
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  src.buffer = noise;
  filter.type = "highpass";
  filter.frequency.value = 7000;
  gain.gain.setValueAtTime(0.08, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  src.connect(filter).connect(gain).connect(out);
  src.start(time);
  src.stop(time + 0.06);
}

const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function WinampWindow() {
  const { t } = useSettings();
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(0.6);
  // Bumped on every (re)start so the visualizer re-binds to the new playback
  const [session, setSession] = useState(0);
  const [tab, setTab] = useState<"chiptunes" | "spotify">("chiptunes");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playback = useRef<{
    out: GainNode;
    analyser: AnalyserNode;
    timer: ReturnType<typeof setTimeout> | null;
    startedAt: number;
    raf: number;
  } | null>(null);

  const stopAudio = useCallback(() => {
    const pb = playback.current;
    if (!pb) return;
    if (pb.timer) clearTimeout(pb.timer);
    cancelAnimationFrame(pb.raf);
    const { ctx } = getAudio();
    pb.out.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
    const out = pb.out;
    setTimeout(() => out.disconnect(), 200);
    playback.current = null;
  }, []);

  const startAudio = useCallback(
    (index: number) => {
      stopAudio();
      const { ctx, master } = getAudio();
      const track = TRACKS[index];
      const eighth = 60 / track.bpm / 2;
      const melody = parse(track.melody);
      const bass = parse(track.bass);
      const loopLength = melody.total * eighth;

      const out = ctx.createGain();
      out.gain.value = volume;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      out.connect(analyser);
      analyser.connect(master);

      const noise = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const startedAt = ctx.currentTime + 0.05;
      playback.current = { out, analyser, timer: null, startedAt, raf: 0 };

      // Schedule one loop at a time, queuing the next just before it ends
      const scheduleLoop = (loopStart: number) => {
        melody.events.forEach((e) => {
          if (e.midi !== null)
            scheduleNote(ctx, out, e.midi, loopStart + e.start * eighth, e.length * eighth, track.lead ?? "square", track.lead ? 0.14 : 0.07);
        });
        bass.events.forEach((e) => {
          if (e.midi !== null) scheduleNote(ctx, out, e.midi, loopStart + e.start * eighth, e.length * eighth, "triangle", 0.18);
        });
        for (let i = 0; i < melody.total; i += 1) {
          const time = loopStart + i * eighth;
          const step = i % 8;
          if (track.hats) scheduleHat(ctx, out, time, noise);
          if (track.kick?.[step] === "x") scheduleKick(ctx, out, time);
          if (track.snare?.[step] === "x") scheduleSnare(ctx, out, time, noise);
        }
        const next = loopStart + loopLength;
        const delay = (next - ctx.currentTime - 0.3) * 1000;
        if (playback.current) playback.current.timer = setTimeout(() => playback.current && scheduleLoop(next), Math.max(0, delay));
      };
      scheduleLoop(startedAt);
    },
    [stopAudio, volume]
  );

  // Visualizer + elapsed time
  useEffect(() => {
    if (!playing) return;
    const canvas = canvasRef.current;
    const ctx2d = canvas?.getContext("2d");
    const pb = playback.current;
    if (!canvas || !ctx2d || !pb) return;
    const bins = new Uint8Array(pb.analyser.frequencyBinCount);
    const gradient = ctx2d.createLinearGradient(0, canvas.height, 0, 0);
    gradient.addColorStop(0, "#00C000");
    gradient.addColorStop(0.6, "#E0E000");
    gradient.addColorStop(1, "#FF3000");

    const draw = () => {
      pb.analyser.getByteFrequencyData(bins);
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.fillStyle = gradient;
      const barWidth = canvas.width / 19;
      for (let i = 0; i < 19; i++) {
        const value = bins[i + 1] / 255;
        const h = Math.max(1, value * canvas.height);
        ctx2d.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h);
      }
      setElapsed(Math.max(0, getAudio().ctx.currentTime - pb.startedAt));
      pb.raf = requestAnimationFrame(draw);
    };
    pb.raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(pb.raf);
  }, [playing, session]);

  useEffect(() => {
    const pb = playback.current;
    if (pb) pb.out.gain.setTargetAtTime(volume, getAudio().ctx.currentTime, 0.02);
  }, [volume]);

  // Stop the music when the window closes
  useEffect(() => stopAudio, [stopAudio]);

  const play = (index = trackIndex) => {
    setTrackIndex(index);
    startAudio(index);
    setSession((n) => n + 1);
    setElapsed(0);
    setPlaying(true);
  };

  const stop = () => {
    stopAudio();
    setPlaying(false);
    setElapsed(0);
  };

  const skip = (delta: number) => {
    const next = (trackIndex + delta + TRACKS.length) % TRACKS.length;
    if (playing) play(next);
    else setTrackIndex(next);
  };

  const track = TRACKS[trackIndex];
  const marquee = `${trackIndex + 1}. ${track.title} *** ${t.winamp.note} *** `;

  const BTN = "w-8 h-6 flex items-center justify-center bg-linear-to-b from-[#5A5A6E] to-[#2E2E3A] border border-[#15151C] text-[#C8C8D8] hover:text-white rounded-[2px]";

  const showSpotify = () => {
    stop();
    setTab("spotify");
  };

  const TAB = "px-2 py-0.5 text-[10px] rounded-t-[2px] border border-b-0 border-[#3B3B4F]";

  return (
    <div className="bg-[#262632] text-[#00E000] font-mono text-xs p-2 select-none">
      <div className="flex gap-0.5" role="tablist">
        <button role="tab" aria-selected={tab === "chiptunes"} onClick={() => setTab("chiptunes")} className={`${TAB} ${tab === "chiptunes" ? "bg-black text-[#00E000]" : "text-[#A0A0B8] hover:text-white"}`}>
          {t.winamp.chiptunesTab}
        </button>
        <button role="tab" aria-selected={tab === "spotify"} onClick={showSpotify} className={`${TAB} ${tab === "spotify" ? "bg-black text-[#1ED760]" : "text-[#A0A0B8] hover:text-white"}`}>
          ♫ {t.winamp.spotifyTab}
        </button>
      </div>

      {tab === "spotify" ? (
        <iframe
          title={t.winamp.spotifyTitle}
          src={SPOTIFY_EMBED}
          width="100%"
          height="152"
          className="block rounded-xl border-0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <>
          <div className="flex gap-2 bg-black border border-[#3B3B4F] p-1.5">
            <div className="flex flex-col justify-between">
              <span className="text-2xl leading-none tracking-wider">{playing ? formatTime(elapsed) : "00:00"}</span>
              <canvas ref={canvasRef} width={76} height={20} className="mt-1" aria-hidden />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="overflow-hidden whitespace-nowrap">
                <span className={`inline-block ${playing ? "winamp-marquee" : ""}`}>
                  {playing ? marquee + marquee : `${trackIndex + 1}. ${track.title}`}
                </span>
              </div>
              <div className="flex gap-2 text-[10px] text-[#00A000]">
                <span>{track.bpm} bpm</span>
                <span>44 kHz</span>
                <span className={playing ? "text-[#00E000]" : ""}>{playing ? "▶ stereo" : t.winamp.stopped}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex gap-0.5">
              <button className={BTN} onClick={() => skip(-1)} aria-label="Previous">
                <FaStepBackward size={10} />
              </button>
              <button className={BTN} onClick={() => play()} aria-label="Play">
                <FaPlay size={10} />
              </button>
              <button className={BTN} onClick={stop} disabled={!playing} aria-label="Pause">
                <FaPause size={10} />
              </button>
              <button className={BTN} onClick={stop} aria-label="Stop">
                <FaStop size={10} />
              </button>
              <button className={BTN} onClick={() => skip(1)} aria-label="Next">
                <FaStepForward size={10} />
              </button>
            </div>
            <label className="flex items-center gap-1 text-[10px] text-[#A0A0B8]">
              {t.winamp.volume}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 accent-[#00C000]"
              />
            </label>
          </div>

          <div className="mt-2 border border-[#3B3B4F]">
            <div className="px-1 py-0.5 text-[10px] text-[#A0A0B8] bg-linear-to-r from-[#3B3B4F] to-[#262632]">{t.winamp.playlist}</div>
            <ol className="bg-black p-1">
              {TRACKS.map((tr, i) => (
                <li key={tr.title}>
                  <button
                    onDoubleClick={() => play(i)}
                    onClick={() => setTrackIndex(i)}
                    className={`w-full text-left px-1 truncate ${i === trackIndex ? "bg-[#0000C6] text-white" : "text-[#00E000] hover:text-white"}`}
                  >
                    {i + 1}. {tr.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}

export default WinampWindow;
