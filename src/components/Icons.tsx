import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useWindow } from "../context/useWindowManager";
import { useSettings } from "../context/useSettings";
import { APPS } from "../windows/registry";
import AppIconView from "./AppIconView";
import type { WindowType } from "../types";

interface Props {
  type: WindowType;
  selected: boolean;
  onSelect: (type: WindowType) => void;
}

// Mouse users double-click like on real XP; touch users open with a single tap
function DesktopIcon({ type, selected, onSelect }: Props) {
  const { openWindow } = useWindow();
  const { t } = useSettings();
  const pointerType = useRef<string>("mouse");
  const label = t.apps[type];

  const open = () => openWindow(type);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <button
      type="button"
      className="flex flex-col items-center w-24 p-1 text-center outline-none group"
      onPointerDown={(e: PointerEvent) => {
        pointerType.current = e.pointerType;
        onSelect(type);
      }}
      onClick={() => pointerType.current !== "mouse" && open()}
      onDoubleClick={() => pointerType.current === "mouse" && open()}
      onKeyDown={handleKeyDown}
      onFocus={() => onSelect(type)}
      aria-label={label}
    >
      <AppIconView
        icon={APPS[type].icon}
        alt=""
        className={`w-12 h-12 mb-1 drop-shadow-[1px_2px_1px_rgba(0,0,0,0.35)] ${selected ? "opacity-70 [filter:sepia(1)_hue-rotate(180deg)_saturate(4)]" : ""}`}
      />
      <span
        className={`text-white text-sm leading-tight px-1 rounded-[1px] break-words ${selected ? "bg-[#316AC5] outline-1 outline-dotted outline-white/70" : ""}`}
        style={{ textShadow: selected ? "none" : "1px 1px 2px #000" }}
      >
        {label}
      </span>
    </button>
  );
}

export default DesktopIcon;
