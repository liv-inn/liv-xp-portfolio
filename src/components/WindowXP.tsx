import { Suspense, useRef, useState, useEffect, useCallback, useLayoutEffect, type MouseEvent, type PointerEvent } from "react";
import { useWindow } from "../context/useWindowManager";
import { useSettings } from "../context/useSettings";
import { APPS } from "../windows/registry";
import AppIconView from "./AppIconView";
import { sounds } from "../lib/sounds";
import type { WindowState } from "../types";

const TITLE_BAR_BUTTON =
  "w-[21px] h-[21px] flex items-center justify-center rounded-[3px] border border-white text-white text-xs font-bold shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.3)]";

function WindowXP({ id, type, minimized, zIndex, maximized, x, y }: WindowState) {
  const { closeWindow, minimizeWindow, focusWindow, toggleMaximize, moveWindow, highestZIndex } = useWindow();
  const { t } = useSettings();
  const app = APPS[type];
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: x ?? 0, y: y ?? 0 });
  const [isVisible, setIsVisible] = useState(x !== undefined);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const isActive = zIndex === highestZIndex;

  // First open: center the window once its real size is known
  useLayoutEffect(() => {
    if (x !== undefined || !windowRef.current) return;
    const { width, height } = windowRef.current.getBoundingClientRect();
    const centered = {
      x: Math.max(0, Math.round(window.innerWidth / 2 - width / 2)),
      y: Math.max(0, Math.round((window.innerHeight - 40) / 2 - height / 2)),
    };
    setPosition(centered);
    setIsVisible(true);
  }, [x]);

  const onPointerMove = useCallback((e: globalThis.PointerEvent) => {
    // Keep the title bar reachable so the window can't be lost off-screen
    const width = windowRef.current?.offsetWidth ?? 0;
    setPosition({
      x: Math.min(Math.max(e.clientX - offset.current.x, 80 - width), window.innerWidth - 80),
      y: Math.min(Math.max(e.clientY - offset.current.y, 0), window.innerHeight - 70),
    });
  }, []);

  const onPointerUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, onPointerMove, onPointerUp]);

  // Persist the position once a drag ends
  const wasDragging = useRef(false);
  useEffect(() => {
    if (wasDragging.current && !dragging) moveWindow(id, position.x, position.y);
    wasDragging.current = dragging;
  }, [dragging, id, moveWindow, position.x, position.y]);

  const onTitlePointerDown = (e: PointerEvent) => {
    if (maximized || (e.target as HTMLElement).closest("button")) return;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setDragging(true);
  };

  const handle = (fn: (id: number) => void) => (e: MouseEvent) => {
    e.stopPropagation();
    sounds.click();
    fn(id);
  };

  const canMaximize = !app.dialog && !app.noMaximize;
  const ContentComponent = app.component;
  const title = t.apps[type];

  const frameStyle = maximized
    ? { top: 0, left: 0, width: "100vw", height: "calc(100vh - 2.5rem)" }
    : { left: position.x, top: position.y };

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-label={title}
      className={`fixed flex flex-col bg-[#ECE9D8] shadow-[2px_4px_12px_rgba(0,0,0,0.45)] font-xp text-black overflow-hidden ${
        isActive ? "border-[3px] border-t-0 border-[#0831D9]" : "border-[3px] border-t-0 border-[#7A96DF]"
      } ${maximized ? "rounded-none" : `${app.size} min-w-64 max-h-[calc(100vh-3rem)] rounded-t-lg`}`}
      onPointerDown={() => focusWindow(id)}
      style={{
        ...frameStyle,
        display: minimized ? "none" : "flex",
        zIndex,
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      <div
        className={`flex items-center justify-between shrink-0 px-1.5 h-[30px] select-none text-white ${maximized ? "" : "rounded-t-md"} ${
          isActive
            ? "bg-[linear-gradient(180deg,#0997FF_0%,#0053EE_8%,#0050EE_40%,#06F_88%,#06F_93%,#005BFF_95%,#003DD7_96%,#003DD7_100%)]"
            : "bg-[linear-gradient(180deg,#A6BFF4_0%,#7A96DF_50%,#7A96DF_100%)]"
        }`}
        style={{ cursor: maximized ? "default" : "move", touchAction: "none" }}
        onPointerDown={onTitlePointerDown}
        onDoubleClick={canMaximize ? handle(toggleMaximize) : undefined}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <AppIconView icon={app.icon} alt="" className="w-4 h-4 shrink-0" />
          <span className="font-bold text-[13px] truncate" style={{ textShadow: "1px 1px #0F1089" }}>
            {title}
          </span>
        </span>
        <div className="flex items-center gap-0.5 shrink-0">
          {!app.dialog && (
            <button title="Minimize" aria-label="Minimize" onClick={handle(minimizeWindow)} className={`${TITLE_BAR_BUTTON} bg-[#2663E8] hover:brightness-125`}>
              <span className="w-2 h-[3px] bg-white mt-2" />
            </button>
          )}
          {canMaximize && (
            <button
              title={maximized ? "Restore" : "Maximize"}
              aria-label={maximized ? "Restore" : "Maximize"}
              onClick={handle(toggleMaximize)}
              className={`${TITLE_BAR_BUTTON} bg-[#2663E8] hover:brightness-125`}
            >
              <span className={`border-2 border-t-[3px] border-white ${maximized ? "w-2 h-2" : "w-2.5 h-2.5"}`} />
            </button>
          )}
          <button title="Close" aria-label="Close" onClick={handle(closeWindow)} className={`${TITLE_BAR_BUTTON} bg-[#E0441C] hover:brightness-125`}>
            ✕
          </button>
        </div>
      </div>

      <div className={`flex-1 min-h-0 ${app.fixedHeight ? "overflow-hidden" : "overflow-y-auto"}`}>
        <Suspense fallback={<div className="p-6 text-xs text-gray-600">Loading...</div>}>
          <ContentComponent id={id} />
        </Suspense>
      </div>
    </div>
  );
}

export default WindowXP;
