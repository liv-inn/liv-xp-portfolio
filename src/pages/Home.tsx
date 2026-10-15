import { useState, useCallback } from "react";
import DesktopIcon from "../components/Icons";
import Nav from "../components/Nav";
import MenuContent from "../components/MenuContent";
import WindowXP from "../components/WindowXP";
import Clippy from "../components/Clippy";
import { useWindow } from "../context/useWindowManager";
import { DESKTOP_ICONS } from "../windows/registry";
import type { WindowType } from "../types";

interface Props {
  onLogOff: () => void;
  onTurnOff: () => void;
}

function Home({ onLogOff, onTurnOff }: Props) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selected, setSelected] = useState<WindowType | null>(null);
  const [clippyVisible, setClippyVisible] = useState(true);
  const { windows } = useWindow();

  const toggleMenu = useCallback(() => setIsMenuVisible((v) => !v), []);
  const closeMenu = useCallback(() => setIsMenuVisible(false), []);

  return (
    <div className="h-screen" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
      <div
        className="flex flex-col flex-wrap content-start items-start gap-1 pt-3 pl-3 h-[calc(100vh-2.5rem)] w-fit"
        onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
      >
        {DESKTOP_ICONS.map((type) => (
          <DesktopIcon key={type} type={type} selected={selected === type} onSelect={setSelected} />
        ))}
      </div>

      {windows.map((win) => (
        <WindowXP key={win.id} {...win} />
      ))}

      {isMenuVisible && (
        <>
          <div className="fixed inset-0 z-[9999]" onClick={closeMenu} />
          <MenuContent onClose={closeMenu} onLogOff={onLogOff} onTurnOff={onTurnOff} />
        </>
      )}

      {clippyVisible && <Clippy onClose={() => setClippyVisible(false)} />}

      <Nav toggleMenu={toggleMenu} onShowClippy={clippyVisible ? undefined : () => setClippyVisible(true)} />
    </div>
  );
}

export default Home;
