import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useSettings } from "../context/useSettings";
import { SpeakerIcon, ClipsterIcon } from "./XpIcons";

const formatTime = (date: Date, lang: string) =>
  date.toLocaleTimeString(lang === "pt" ? "pt-BR" : "en-US", { hour: "numeric", minute: "2-digit" });

function SystemTray({ onShowClippy }: { onShowClippy?: () => void }) {
  const { t, lang, toggleLang, muted, toggleMuted } = useSettings();
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // Only re-render when the minute actually changes
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setTime(new Date());
      interval = setInterval(() => setTime(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-full flex items-center gap-2 bg-[linear-gradient(180deg,#0C59B9_0%,#139EE9_8%,#18B5F2_12%,#139BEB_20%,#1290E8_80%,#0D8DEA_92%,#095BC9_100%)] border-l border-[#0A3F9C] shadow-[inset_1px_0_1px_#18BBFF] px-2 shrink-0">
      <button
        onClick={toggleLang}
        title={t.tray.language}
        className="text-[11px] font-bold bg-[#1C3F9E] border border-white/40 rounded-sm px-1 leading-4 hover:brightness-125"
      >
        {lang.toUpperCase()}
      </button>
      {onShowClippy && (
        <button onClick={onShowClippy} title={t.tray.showClippy} aria-label={t.tray.showClippy} className="hover:brightness-125">
          <ClipsterIcon className="w-4 h-4" />
        </button>
      )}
      <button onClick={toggleMuted} title={muted ? t.tray.unmute : t.tray.mute} aria-label={muted ? t.tray.unmute : t.tray.mute} className="hover:brightness-125">
        <SpeakerIcon muted={muted} className="w-4 h-4" />
      </button>
      <div className="relative group hidden sm:block">
        <FaHeart className="text-pink-300 text-xs cursor-default" />
        <div className="absolute bottom-full right-0 mb-3 w-max bg-[#FFFFE1] text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-black pointer-events-none flex items-center">
          {t.tray.madeWith} <FaHeart className="inline mx-1 text-red-500" /> {t.tray.by}
        </div>
      </div>
      <span className="text-xs whitespace-nowrap">{formatTime(time, lang)}</span>
    </div>
  );
}

export default SystemTray;
