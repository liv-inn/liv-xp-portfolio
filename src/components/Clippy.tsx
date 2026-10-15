import { useEffect, useState } from "react";
import { useSettings } from "../context/useSettings";
import { useWindow } from "../context/useWindowManager";
import { sounds } from "../lib/sounds";

const APPEAR_DELAY = 5000;
const TIP_INTERVAL = 25000;

// An original paperclip assistant, lovingly inspired by the 2000s office helpers
function ClipsterCharacter({ blink }: { blink: boolean }) {
  return (
    <svg viewBox="0 0 80 110" className="w-20 h-28 drop-shadow-[2px_3px_2px_rgba(0,0,0,0.35)] clipster-bob" aria-hidden>
      <path
        d="M30 100 V30 a16 16 0 0 1 32 0 V82 a9 9 0 0 1 -18 0 V36"
        fill="none"
        stroke="#9AA5B1"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M30 100 V30 a16 16 0 0 1 32 0 V82 a9 9 0 0 1 -18 0 V36"
        fill="none"
        stroke="#E3E8EE"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g transform="translate(0 4)">
        <ellipse cx="34" cy="38" rx="9" ry={blink ? 1 : 10} fill="#fff" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="57" cy="38" rx="9" ry={blink ? 1 : 10} fill="#fff" stroke="#333" strokeWidth="1.5" />
        {!blink && (
          <>
            <circle cx="36" cy="40" r="4" fill="#222" />
            <circle cx="55" cy="40" r="4" fill="#222" />
          </>
        )}
        <path d="M25 24 q8 -6 16 -1" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50 23 q8 -5 15 1" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Clippy({ onClose }: { onClose: () => void }) {
  const { t } = useSettings();
  const { openWindow } = useWindow();
  const [visible, setVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [blink, setBlink] = useState(false);
  const tips = t.clippy.tips;
  const tip = tips[tipIndex % tips.length];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      sounds.ding();
    }, APPEAR_DELAY);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const rotate = setInterval(() => setTipIndex((i) => i + 1), TIP_INTERVAL);
    const blinker = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800);
    return () => {
      clearInterval(rotate);
      clearInterval(blinker);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed right-3 bottom-12 z-[9000] flex flex-col items-end gap-1 max-w-[min(18rem,calc(100vw-1.5rem))] font-xp clipster-in">
      <div className="relative bg-[#FFFFE1] border border-black rounded-lg p-3 text-xs text-black shadow-lg" role="status">
        <button onClick={onClose} className="absolute top-1 right-1.5 text-gray-500 hover:text-black" aria-label={t.clippy.close} title={t.clippy.close}>
          ✕
        </button>
        <p className="font-bold mb-1">{t.clippy.name}</p>
        <p className="pr-3">{tip.text}</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {tip.action && (
            <button
              onClick={() => openWindow(tip.action!)}
              className="px-2 py-0.5 bg-[#ECE9D8] border border-[#003C74] rounded-[3px] hover:bg-white"
            >
              {tip.actionLabel}
            </button>
          )}
          <button onClick={() => setTipIndex((i) => i + 1)} className="px-2 py-0.5 bg-[#ECE9D8] border border-[#003C74] rounded-[3px] hover:bg-white">
            {t.clippy.next}
          </button>
        </div>
        <span className="absolute -bottom-2 right-10 w-4 h-4 bg-[#FFFFE1] border-r border-b border-black rotate-45" />
      </div>
      <button onClick={() => setTipIndex((i) => i + 1)} aria-label={t.clippy.next} className="mr-4">
        <ClipsterCharacter blink={blink} />
      </button>
    </div>
  );
}

export default Clippy;
