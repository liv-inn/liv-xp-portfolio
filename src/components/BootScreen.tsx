import { useEffect } from "react";
import { useSettings } from "../context/useSettings";

const BOOT_DURATION = 3200;

const HEART = ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"];

export function PixelHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 7 6" className={className} shapeRendering="crispEdges" aria-hidden>
      {HEART.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={y < 2 ? "#FF8AC8" : y < 4 ? "#FF4FA3" : "#E0287E"} /> : null
        )
      )}
    </svg>
  );
}

export function LivXpLogo({ size = "text-5xl" }: { size?: string }) {
  return (
    <div className={`font-sans font-bold italic tracking-tight select-none ${size}`}>
      <span className="text-white">Liv</span>
      <span className="text-[#FF7A1A] align-super text-[0.55em] ml-1">xp</span>
    </div>
  );
}

function BootScreen({ onDone }: { onDone: () => void }) {
  const { t } = useSettings();

  useEffect(() => {
    const timer = setTimeout(onDone, BOOT_DURATION);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer"
      onClick={onDone}
      title={t.boot.skip}
    >
      <div className="flex flex-col items-center gap-2">
        <PixelHeart className="w-14 h-14 mb-2" />
        <span className="text-white/80 font-sans text-sm tracking-wide">Lívia Neves</span>
        <LivXpLogo />
      </div>

      <div className="mt-14 w-44 h-5 border-2 border-[#B2B2B2] rounded-md overflow-hidden p-[2px]" role="progressbar" aria-label={t.boot.loading}>
        <div className="boot-bar flex gap-[2px] h-full">
          <span className="w-2.5 h-full bg-linear-to-b from-[#6C9BFF] via-[#2A5FE3] to-[#6C9BFF] rounded-[1px]" />
          <span className="w-2.5 h-full bg-linear-to-b from-[#6C9BFF] via-[#2A5FE3] to-[#6C9BFF] rounded-[1px]" />
          <span className="w-2.5 h-full bg-linear-to-b from-[#6C9BFF] via-[#2A5FE3] to-[#6C9BFF] rounded-[1px]" />
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-8 font-sans text-xs text-white/60">
        <span>{t.boot.copyright}</span>
        <span>{t.boot.skip}</span>
      </div>
    </div>
  );
}

export default BootScreen;
